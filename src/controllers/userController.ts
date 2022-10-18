import { Integrations } from "../integrations/integrations"
import { UserDoc } from "../models/user"

class UserController {
  usersMap: Map<string, Integrations>

  constructor() {
    this.usersMap = new Map<string, Integrations>()
  }

  createUser(userId: string, name: string) {
    this.usersMap.set(userId, new Integrations(userId))
  }

  getUserIntegrations(userId: string): Integrations {
    return this.usersMap.get(userId)
  }

  async initUsers(users: UserDoc[]) {
    for(const user of users) {
      this.usersMap.set(user._id.toString(), new Integrations(user._id))
      if(user.discord) {
        // bizonho
        this.getUserIntegrations(user._id.toString()).startDiscordIntegration(user.discord.token).then(() => {
          console.log('TEMPORARIO! subiu o discord pro ' + user._id.toString())
        })
      }
    }
  }
}

const userControllerSingleton = (function() {
  let instance: UserController
  return {
    getInstance: function(): UserController {
      if(!instance)
        instance = new UserController()
      return instance
    }
  }
})();


export { userControllerSingleton }