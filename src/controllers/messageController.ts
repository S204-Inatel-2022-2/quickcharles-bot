import { Message } from "../models/message";
import { parseDatabaseError } from "../utils/databaseUtils";

class MessageController {
  #userId: string

  constructor(userId: string) {
    this.#userId = userId
  }

  async getPayloadFromKeyord(keyword: string) {
    const message = await Message.findOne({ _userId: this.#userId, keyword })
    if(message?.payload) {
      return message.payload
    } else {
      return null
    }
  }
}

export { MessageController }