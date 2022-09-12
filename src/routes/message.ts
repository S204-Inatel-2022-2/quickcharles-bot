import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication";
import { Message } from "../models/message";

const router = Router()

router.use(authenticationMiddleware)

router.get('/message', async (req, res) => {
  const messages = await Message.find({})
  return res.status(200).send(messages)
})

router.post('/message', (req, res) => {
  const { keyword, payload } = req.body

  const message = Message.build({ keyword, payload })
  message.save().then(() => {
    return res.status(200).send(message)
  }).catch(err => {
    return res.status(400).send({ error: err })
  })
})

export { router as messageRouter }