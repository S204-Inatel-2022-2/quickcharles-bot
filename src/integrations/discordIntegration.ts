import { CacheType, ChatInputCommandInteraction, Client, GatewayIntentBits, Interaction } from 'discord.js'

class DiscordIntegration implements IIntegration {
  #token: string
  #client: Client
  #isLogged: boolean

  constructor(token: string) {
    this.#token = token
    this.#isLogged = false
    this.#client = new Client({ intents: [GatewayIntentBits.Guilds] })
  }

  async login() {
    const loginStatus = await this.#client.login(this.#token)
    // todo: testar retorno do login
    this.#isLogged = true
  }

  onTextMessage(cb: (text: string, sendMessage: (text: string) => Promise<boolean>) => void): void {
    this.#client.on('interactionCreate', (interaction) => {
      if(!interaction.isChatInputCommand()) {
        return
      }

      const incomingText = interaction.commandName

      cb(incomingText, this.#getSendMessageMethod(interaction))
    })
  }

  #getSendMessageMethod(interaction: ChatInputCommandInteraction): (text: string) => Promise<boolean> {
    return async (text: string) => {
      if(this.#isLogged) {
        const replyStatus = await interaction.reply(text)
        // todo: testar retorno do reply
        return Promise.resolve(true)
      } else {
        return Promise.reject('not logged in')
      }
    }
  }
}

export { DiscordIntegration }