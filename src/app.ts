import express from 'express';

const app = express()
const API_PORT = 3000

app.get('/', (req, res, next) => {
  res.status(200).send({
    success: true,
    message: 'salve'
  })
})

app.listen(API_PORT, () => {
  console.log(`Escutando na portera: ${API_PORT}`)
})