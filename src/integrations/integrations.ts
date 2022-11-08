import { DiscordIntegration } from "./discordIntegration"
import { MessageController } from "../controllers/messageController"
import { WhatsappIntegration } from "./whatsappIntegration"
import { register } from "./whatsappUtils"

class Integrations {
  #userId: string
  discord: DiscordIntegration
  whatsapp: WhatsappIntegration

  constructor(userId: string) {
    this.#userId = userId
  }

  async startDiscordIntegration(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.discord = new DiscordIntegration(token, new MessageController(this.#userId))
      
      this.discord.login()
        .then(() => {
          this.discord.addListners()
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async registerWhatsappIntegration() {
    return register(this.#userId)
  }

  async startWhatsappIntegration(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.whatsapp = new WhatsappIntegration(this.#userId, new MessageController(this.#userId))
  
      this.whatsapp.login()
        .then(() => {
          this.whatsapp.addListners()
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export { Integrations }