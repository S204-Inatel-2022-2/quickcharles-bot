import { DiscordIntegration } from "./discordIntegration"

class Integrations {
  discord: IIntegration

  startDiscordIntegration(token: string) {
    this.discord = new DiscordIntegration(token)
  }
}

export { Integrations }