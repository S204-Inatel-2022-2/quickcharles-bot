import mongoose from "mongoose";

type DiscordIntegrationInfo = {
  token: string
}

interface IUser {
  token: string
  name: string
  discord?: DiscordIntegrationInfo
}

interface UserDoc extends mongoose.Document {
  token: string
  name: string
  discord?: DiscordIntegrationInfo
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

const userSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  discord: discordSchema
})



userSchema.statics.build = (attr: IUser) => {
  return new User(attr)
}

const User = mongoose.model<UserDoc, UserModelInterface>('User', userSchema)

export { User, UserDoc }