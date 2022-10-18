import mongoose, { Types } from "mongoose";

interface IMessage {
  _userId: Types.ObjectId
  keyword: string
  payload: string
}

interface MessageDoc extends mongoose.Document {
  _userId: Types.ObjectId
  keyword: string
  payload: string
}

interface MessageModelInterface extends mongoose.Model<MessageDoc> {
  build(attr: IMessage): MessageDoc
}

const messageSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
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

export { Message, MessageDoc }