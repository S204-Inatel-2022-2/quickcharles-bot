import { Router } from "express";
import { Types } from "mongoose";
import { createUserToken } from "../controllers/authenticationController";
import { authenticationMiddleware } from "../middlewares/authentication";
import { User } from "../models/user";

const router = Router()

router.get('/user', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const user = await User.findOne({ _id: userObjectId })
  return res.status(200).send(user)
})

router.post('/user', async (req, res) => {
  const { name } = req.body
  const token = createUserToken({ name })

  if(name) {
    const user = User.build({ token, name })

    user.save().then(() => {
      return res.status(200).send(user)
    }).catch((err) => {
      return res.status(400).send({ error: err })
    })
  } else {
    return res.status(400).send({ error: 'misssing body data' })
  }
})

export { router as userRouter }