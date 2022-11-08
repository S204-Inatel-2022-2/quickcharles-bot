import makeWASocket, { BufferJSON, DisconnectReason, initAuthCreds, proto, useMultiFileAuthState } from "@adiwajshing/baileys"
import { User, UserDoc } from "../models/user"

import { Boom } from '@hapi/boom'

// Metodo baseado no 'useMultiFileAuthState'.
const useUserDocAuthState = async (userId: string) => {
  const writeData = async (data: string, key: string, userId: string) => {
    const dataString = JSON.stringify(data, BufferJSON.replacer)

    // Isso aqui eh meme demais KKKKKKK
    let prev 
    try {
      const user = await User.findOne({ _id: userId }).exec()
      prev = user.whatsapp?.session
    } catch(_) {
      return false
    }

    // 🤣
    const keyedData = {...prev}
    keyedData[key] = dataString

    try {
      await User.findOneAndUpdate({ _id: userId }, {
        whatsapp: {
          session: keyedData
        }
      }).exec()
      return true
    } catch(_) {
      return false // Isso aqui ta completamente errado!
    }
  }

  const readData = async (key: string, userId: string) => {
    let user: UserDoc
    try {
      user = await User.findOne({ _id: userId }).exec()
    } catch(_) {
      return null
    }
    if(user.whatsapp) {
      const data = user.whatsapp.session
      if(key in data) {
        const parsed = JSON.parse(data[key], BufferJSON.reviver)
        return parsed
      } else {
        return null
      }
    } else {
      return null
    }
  }

  const removeData = async (key: string, userId: string) => {
    const keyedData = {}
    keyedData[key] = null

    try {
      await User.findOneAndUpdate({ _id: userId }, {
        whatsapp: {
          session: keyedData
        }
      }).exec()
      return true
    } catch(_) {
      return false // Isso aqui ta completamente errado!
    }
  }

  const creds = await readData('creds', userId) || initAuthCreds()

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {}
          await Promise.all(ids.map(async (id) => {
            let value = await readData(`${type}-${id}`, userId)
            if (type === 'app-state-sync-key' && value) {
              value = proto.Message.AppStateSyncKeyData.fromObject(value)
            }
            data[id] = value
          }))
          return data
        },
        set: async (data) => {
          const tasks = []
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id]
              const key = `${category}-${id}`
              tasks.push(value ? writeData(value, key, userId) : removeData(key, userId))
            }
          }
          await Promise.all(tasks)
        }
      }
    },
    saveCreds: () => {
      return writeData(creds, 'creds', userId)
    }
  }
}

const register = async (userId: string): Promise<string> => {
  const { state, saveCreds } = await useUserDocAuthState(userId)
  
  const socket = makeWASocket({
    auth: state
  })

  socket.ev.on('creds.update', saveCreds)

  return new Promise<string>((resolve, reject) => {
    socket.ev.on('connection.update', c => {
      const { connection, lastDisconnect } = c

      if(c.qr) {
        resolve(c.qr)
      }
      
      if(connection === 'close') {
        const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        
        if(shouldReconnect) {
          const tempSock = makeWASocket({
            auth: state
          })
          tempSock.ev.on('connection.update', (update) => {
            if(update.connection === 'open'){
              tempSock.ev.removeAllListeners(null)
              tempSock.end(null)
            }
          })
        }
      }
    })
  })
}


export {
  register,
  useUserDocAuthState
}