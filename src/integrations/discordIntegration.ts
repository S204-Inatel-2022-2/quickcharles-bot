import { Client, GatewayIntentBits } from 'discord.js'
import { MessageEngine } from './messageEngine'

class DiscordIntegration /* implements IIntegration */ {
  #token: string
  #client: Client
  #isLogged: boolean
  #engine: MessageEngine

  constructor(token: string, engine: MessageEngine) {
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

      const payload = await this.#engine.getPayloadFromKeyord(incomingText)
      if(payload) {
        message.reply({
          content: payload
        })
      }
    })
  }
}

export { DiscordIntegration }