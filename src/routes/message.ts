import { Router } from "express";
import { Types } from "mongoose";
import { authenticationMiddleware } from "../middlewares/authentication";
import { Message } from "../models/message";

const router = Router()

router.get('/message', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const messages = await Message.find({ _userId: userObjectId })
  return res.status(200).send(messages)
})

router.post('/message', authenticationMiddleware, (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const { keyword, payload } = req.body

  if(keyword && payload) {
    const message = Message.build({ _userId: userObjectId, keyword, payload })
    
    message.save().then(() => {
      return res.status(200).send(message)
    }).catch(err => {
      return res.status(400).send({ error: err })
    })
  } else {
    return res.status(400).send({ error: 'misssing body data' })
  }

})

export { router as messageRouter }