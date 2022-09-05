import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import { userRouter } from './routes/user';

const app = express()
const API_PORT = 3000

mongoose.connect('mongodb://localhost:27017/quickcharles', {}, () => {
  console.log(`Conectado no mongo.`)
})

app.use(bodyParser.json())
app.use(userRouter)

app.listen(API_PORT, () => {
  console.log(`Escutando na portera: ${API_PORT}`)
})