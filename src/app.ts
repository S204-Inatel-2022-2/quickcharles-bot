import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import { userControllerSingleton } from './controllers/userController';
import { User } from './models/user';
import { discordRouter } from './routes/discord';
import { messageRouter } from './routes/message';
import { userRouter } from './routes/user';
import { whatsappRouter } from './routes/whatsapp';

const app = express()
const API_PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/quickcharles'

mongoose.connect(MONGO_URI, {}, async () => {
  console.log(`Conectado no mongo.`)
  User.find({}).exec()
    .then(users => {
      const userController = userControllerSingleton.getInstance()
      userController.initUsers(users)
        .then(() => {
          console.log('Todos os usuarios registrados!')
          console.table(userController.usersMap)
        })
    })
    .catch(err => {
      console.error('[app.ts][initUsers] - err: ', err.message)
    })
})

app.use(bodyParser.json())
app.use(userRouter)
app.use(messageRouter)
app.use(discordRouter)
app.use(whatsappRouter)

console.log(process.env)

app.get('/', (_, res) => {
  return res.status(200).json('quickchales-bot :)')
})

app.listen(API_PORT, () => {
  console.log(`Escutando na portera: ${API_PORT}`)
})