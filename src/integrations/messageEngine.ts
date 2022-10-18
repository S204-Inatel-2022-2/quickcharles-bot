import { Message } from "../models/message";

class MessageEngine {
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

export { MessageEngine }