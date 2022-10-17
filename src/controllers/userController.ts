import { Integrations } from "../integrations/integrations"
import { UserDoc } from "../models/user"


class UserController {
  usersMap: Map<string, Integrations>

  constructor() {
    this.usersMap = new Map<string, Integrations>()
  }

  createUser(token: string, name: string) {
    this.usersMap.set(token, new Integrations())
  }

  getUserIntegrations(token: string): Integrations {
    return this.usersMap.get(token)
  }

  async initUsers(users: UserDoc[]) {

    // todo: subir ja com as integrações cadastradas
    for(const user of users) {
      this.usersMap.set(user.token, new Integrations())
    }
  }
}