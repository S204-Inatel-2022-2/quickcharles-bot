import { DiscordIntegration } from "./discordIntegration"
import { MessageEngine } from "./messageEngine"

class Integrations {
  #userId: string
  discord: DiscordIntegration

  constructor(userId: string) {
    this.#userId = userId
  }

  async startDiscordIntegration(token: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.discord = new DiscordIntegration(token, new MessageEngine(this.#userId))
      
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
}

export { Integrations }