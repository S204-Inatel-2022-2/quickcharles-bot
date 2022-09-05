import mongoose from "mongoose";

interface IMessage {
  keyword: string
  payload: string
}

interface MessageDoc extends mongoose.Document {
  keyword: string
  payload: string
}

interface MessageModelInterface extends mongoose.Model<MessageDoc> {
  build(attr: IMessage): MessageDoc
}

const messageSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true
  },
  payload: {
    type: String,
    required: true
  }
})

messageSchema.statics.build = (attr: IMessage) => {
  return new Message(attr)
}

const Message = mongoose.model<MessageDoc, MessageModelInterface>('Message', messageSchema)

export { Message }