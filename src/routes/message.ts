import { Router } from "express";
import { Types } from "mongoose";
import { authenticationMiddleware } from "../middlewares/authentication";
import { Message } from "../models/message";
import { filterDatabaseData, parseDatabaseError } from "../utils/databaseUtils";

const router = Router()

router.get('/message', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const { id } = req.query

  // query com um id inexistente da erro: 'Cast to ObjectId failed for value "<id>" (type string) at path "_id" for model "Message"'
  if(id) {
    Message.findOne({ _userId: userObjectId, _id: id }).exec()
    .then(messages => {
      return res.status(200).send(filterDatabaseData(messages))
    })
    .catch(err => {
      const { statusCode, responseJson } = parseDatabaseError(err)
      return res.status(statusCode).json(responseJson)
    })
  } else {
    Message.find({ _userId: userObjectId }).exec()
      .then(messages => {
        return res.status(200).send(filterDatabaseData(messages))
      })
      .catch(err => {
        const { statusCode, responseJson } = parseDatabaseError(err)
        return res.status(statusCode).json(responseJson)
      })
  }
})

router.post('/message', authenticationMiddleware, (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const { keyword, payload } = req.body

  if(keyword && payload) {
    const message = Message.build({ _userId: userObjectId, keyword, payload })
    
    message.save().then(() => {
      return res.status(200).send(filterDatabaseData(message))
    }).catch(err => {
      return res.status(400).send({ error: err })
    })
  } else {
    return res.status(400).send({ error: 'misssing body data' })
  }
})

router.put('/message', authenticationMiddleware, (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const { id } = req.query
  const { keyword, payload } = req.body

  if(id && (keyword || payload)) {
    Message.findOneAndUpdate({ _userId: userObjectId, _id: id }, {
      keyword: keyword ? keyword : undefined,
      payload: payload ? payload : undefined
    }, { new: true }).exec()
      .then(message => {
        return res.status(200).send(filterDatabaseData(message))
      })
      .catch(err => {
        const { statusCode, responseJson } = parseDatabaseError(err)
        return res.status(statusCode).json(responseJson)
      })
  } else {
    return res.status(400).send({ error: 'misssing query or/and body data' })
  }
})

router.delete('/message', authenticationMiddleware, (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  const { id } = req.query

  if(id) {
    Message.findOneAndDelete({ _userId: userObjectId, _id: id }).exec()
      .then(message => {
        return res.status(200).send({ success: true })
      })
      .catch(err => {
        const { statusCode, responseJson } = parseDatabaseError(err)
        return res.status(statusCode).json(responseJson)
      })
  } else {
    return res.status(400).send({ error: 'misssing query or/and body data' })
  }
})

export { router as messageRouter }