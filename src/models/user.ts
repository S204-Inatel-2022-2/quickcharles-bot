import mongoose from "mongoose";

interface IUser {
  token: string
  name: string
}

interface UserDoc extends mongoose.Document {
  token: string
  name: string
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc
}

const userSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

userSchema.statics.build = (attr: IUser) => {
  return new User(attr)
}

const User = mongoose.model<UserDoc, UserModelInterface>('User', userSchema)

export { User }