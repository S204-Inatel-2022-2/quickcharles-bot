import mongoose, { mongo } from "mongoose";

type DiscordIntegrationInfo = {
  token: string
}

type WhatsappIntegrationInfo = {
  session: any
}

interface IUser {
  token: string
  name: string
  discord?: DiscordIntegrationInfo
  whatsapp?: WhatsappIntegrationInfo
}

interface UserDoc extends mongoose.Document {
  token: string
  name: string
  discord?: DiscordIntegrationInfo
  whatsapp?: WhatsappIntegrationInfo
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc
}

const discordSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  }
})

const whatsappSchema = new mongoose.Schema({
  session: {
    type: {},
    required: true
  }
})

const userSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  discord: discordSchema,
  whatsapp: whatsappSchema
})



userSchema.statics.build = (attr: IUser) => {
  return new User(attr)
}

const User = mongoose.model<UserDoc, UserModelInterface>('User', userSchema)

export { User, UserDoc }