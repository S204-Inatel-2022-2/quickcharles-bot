import { Router } from "express";
import { Types } from "mongoose";
import { userControllerSingleton } from "../controllers/userController";
import { authenticationMiddleware } from "../middlewares/authentication";
import { User } from "../models/user";

const router = Router()

router.get('/discord', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const user = await User.findOne({ _id: userObjectId })
  if(user.discord) {
    return res.status(200).send(user.discord)
  } else {
    return res.status(400).send({ error: 'discord not integrated for this user' })
  }
})

router.post('/discord', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  
  const { token } = req.body

  if(token) {
    const user = await User.findOneAndUpdate({ _id: userObjectId }, {
      discord: {
        token: token
      }
    })

    user.save().then(() => {
      return res.status(200).send(user)
    }).catch((err) => {
      return res.status(400).send({ error: err })
    })
  } else {
    return res.status(400).send({ error: 'misssing body data' })
  }
})

router.post('/discord/up', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId

  const user = await User.findOne({ _id: userObjectId })
  if(user.discord) {
    const token = user.discord.token
    // const clientId = user.discord.clientId
    
    const userController = userControllerSingleton.getInstance()
    const userIntegrations = userController.getUserIntegrations(userObjectId.toString())

    userIntegrations.startDiscordIntegration(token /*, clientId */)
      .then(() => {
        return res.status(200).send({ success: true })
      })
      .catch(err => {
        return res.status(400).send({ error: err.message ? err.message : err })
      })
  } else {
    return res.status(400).send({ error: 'discord not integrated for this user' })
  }
})


export { router as discordRouter }