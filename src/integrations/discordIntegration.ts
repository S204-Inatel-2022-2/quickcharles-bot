import { Client, GatewayIntentBits } from 'discord.js'
import { MessageController } from '../controllers/messageController'

class DiscordIntegration /* implements IIntegration */ {
  #token: string
  #client: Client
  #isLogged: boolean
  #engine: MessageController

  constructor(token: string, engine: MessageController) {
    this.#token = token
    this.#engine = engine
    this.#isLogged = false
    this.#client = new Client({ intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent
    ] })
  }

  async login(): Promise<void> {
    await this.#client.login(this.#token)
    this.#client.on('ready', () => {
      this.#isLogged = true
    });
  }
  
  addListners() {
    this.addMessageCreateEvent()
  }

  addMessageCreateEvent(): void {
    this.#client.on('messageCreate', async (message) => {
      const incomingText = message.content
      let payload = null
      try {
        payload = await this.#engine.getPayloadFromKeyord(incomingText)
      } catch(err) {
        console.error('[DiscordIntegration][getPayloadFromKeyord] - error:', err)
      }
      if(payload) {
        message.reply({
          content: payload
        })
      }
    })
  }
}

export { DiscordIntegration }