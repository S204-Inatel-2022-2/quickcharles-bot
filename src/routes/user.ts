import { Router } from "express";
import { User } from "../models/user";

const router = Router()

router.get('/user', async (req, res) => {
  const users = await User.find({})
  return res.status(200).send(users)
})

router.post('/user', async (req, res) => {
  const { name } = req.body
  const token = '123-asd-456-zxc'

  const user = User.build({ token, name })
  
  user.save().then(() => {
    return res.status(200).send(user)
  }).catch((err) => {
    return res.status(400).send({ error: err })
  })
})

export { router as userRouter }