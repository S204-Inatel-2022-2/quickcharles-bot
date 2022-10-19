import { Request, Response, Router } from "express";
import { Types } from "mongoose";
import { userControllerSingleton } from "../controllers/userController";
import { authenticationMiddleware } from "../middlewares/authentication";
import { User } from "../models/user";
import { parseDatabaseError } from "../utils/databaseUtils";

const router = Router()

router.get('/discord', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  User.findOne({ _id: userObjectId }).exec()
    .then(user => {
      if(user.discord) {
        return res.status(200).send(user.discord)
      } else {
        return res.status(400).send({ error: 'discord not integrated for this user' })
      }
    })
    .catch(err => {
      const { statusCode, responseJson } = parseDatabaseError(err)
      return res.status(statusCode).json(responseJson)
    })
})

const discordPostPut = async (req: Request, res: Response) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  
  const { token } = req.body

  if(token) {
    User.findOneAndUpdate({ _id: userObjectId }, {
      discord: {
        token: token
      }
    }).exec()
      .then(user => {
        return res.status(200).send(user)
      })
      .catch(err => {
        const { statusCode, responseJson } = parseDatabaseError(err)
        return res.status(statusCode).json(responseJson)
      })
  } else {
    return res.status(400).send({ error: 'misssing body data' })
  }
}
router.post('/discord', authenticationMiddleware, discordPostPut)
router.put('/discord', authenticationMiddleware, discordPostPut)

router.delete('/discord', authenticationMiddleware, async (req: Request, res: Response) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  
  User.findOneAndUpdate({ _id: userObjectId }, {
    discord: null
  }).exec()
    .then(user => {
      return res.status(200).send(user)
    })
    .catch(err => {
      const { statusCode, responseJson } = parseDatabaseError(err)
      return res.status(statusCode).json(responseJson)
    })
})

router.post('/discord/up', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId

  User.findOne({ _id: userObjectId }).exec()
    .then(user => {
      if(user.discord) {
        const token = user.discord.token
        
        const userController = userControllerSingleton.getInstance()
        const userIntegrations = userController.getUserIntegrations(userObjectId.toString())
    
        userIntegrations.startDiscordIntegration(token)
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
    .catch(err => {
      const { statusCode, responseJson } = parseDatabaseError(err)
      return res.status(statusCode).json(responseJson)
    })
})


export { router as discordRouter }