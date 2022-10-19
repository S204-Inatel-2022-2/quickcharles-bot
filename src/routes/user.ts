import { Router } from "express";
import { Types } from "mongoose";
import { createUserToken } from "../controllers/authenticationController";
import { userControllerSingleton } from "../controllers/userController";
import { authenticationMiddleware } from "../middlewares/authentication";
import { User } from "../models/user";
import { parseDatabaseError } from "../utils/databaseUtils";

const router = Router()

router.get('/user', authenticationMiddleware, async (_, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  User.findOne({ _id: userObjectId })
    .then(user => {
      return res.status(200).send(user)
    })
    .catch(err => {
      const { statusCode, responseJson } = parseDatabaseError(err)
      return res.status(statusCode).json(responseJson)
    })
})

router.post('/user', async (req, res) => {
  const { name } = req.body
  const token = createUserToken({ name })

  if(name) {
    const user = User.build({ token, name })

    user.save().then(() => {
      const userContoller = userControllerSingleton.getInstance()
      try {
        userContoller.addUser(user._id.toString())
        return res.status(200).send(user)
      } catch(err) {
        return res.status(500).send({ error: 'cant add user?' })
      }
    }).catch((err) => {
      return res.status(400).send({ error: err })
    })
  } else {
    return res.status(400).send({ error: 'misssing body data' })
  }
})

router.put('/user', authenticationMiddleware, (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const { name } = req.body

  if(name) {
    User.findOneAndUpdate({ _id: userObjectId }, {
      name: name
    }).exec()
      .then(user => {
        // retorna user NAO atualizado
        return res.status(200).send(user)
      })
      .catch(err => {
        const { statusCode, responseJson } = parseDatabaseError(err)
        return res.status(statusCode).json(responseJson)
      })
  } else {
    return res.status(400).send({ error: 'misssing body data' })
  }
})

// todo: deletar as mensagens tb
router.delete('/user', authenticationMiddleware, (_, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId

  User.findOneAndDelete({ _id: userObjectId }).exec()
    .then(() => {
      return res.status(200).send({ success: true })
    })
    .catch(err => {
      const { statusCode, responseJson } = parseDatabaseError(err)
      return res.status(statusCode).json(responseJson)
    })
})

export { router as userRouter }