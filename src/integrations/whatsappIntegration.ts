import makeWASocket, { proto, useMultiFileAuthState, WASocket } from "@adiwajshing/baileys"
import { MessageController } from "../controllers/messageController"
import { useUserDocAuthState } from "./whatsappUtils"

class WhatsappIntegration /* implements IIntegration */ {
  #userId: string
  #socket: WASocket
  #isLogged: boolean
  #engine: MessageController

  constructor(userId: string, engine: MessageController) {
    this.#userId = userId
    this.#isLogged = false
    this.#engine = engine
  }

  async login() {
    const { state } = await useUserDocAuthState(this.#userId)

    this.#socket = makeWASocket({
      auth: state
    })

    return new Promise<void>((resolve, reject) => {
      this.#socket.ev.on('connection.update', c => {
        const { connection } = c
  
        if(connection === 'open') {
          this.#isLogged = true
          resolve()
        } else if(connection === 'close') {
          this.#isLogged = false
        }
      })
    })
  }

  addListners() {
    this.#socket.ev.on('messages.upsert', async m => {
      const message = m.messages[0]
      const remoteJid = message.key.remoteJid!
      const incomingText = this.#getMessage(message)

      let payload = null
      try {
        payload = await this.#engine.getPayloadFromKeyord(incomingText)
      } catch(err) {
        console.error('[WhatsappIntegration][getPayloadFromKeyord] - error:', err)
      }
      if(payload) {
        await this.#socket.sendMessage(remoteJid, { text: payload })
      }
    })
  }

  #getMessage(message: proto.IWebMessageInfo) {
    if(!message.key?.fromMe) {
      if(message.message?.conversation) {
        return message.message.conversation
      }
    }
  }
}

export { WhatsappIntegration }