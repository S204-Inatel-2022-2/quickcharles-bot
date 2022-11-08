import { Router } from "express"
import { Types } from "mongoose"
import { userControllerSingleton } from "../controllers/userController"
import { authenticationMiddleware } from "../middlewares/authentication"

const router = Router()

// GET, e DELETE so dps q tiver no banco.
// o que fazer com o PUT??

router.post('/whatsapp/register', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId
  
  const userController = userControllerSingleton.getInstance()
  const userIntegrations = userController.getUserIntegrations(userObjectId.toString())
  
  const qr = await userIntegrations.registerWhatsappIntegration()

  return res.status(200).send({
    success: true,
    qr: qr
  })
})

router.post('/whatsapp/up', authenticationMiddleware, async (req, res) => {
  const userObjectId: Types.ObjectId = res.locals.userObjectId

  const userController = userControllerSingleton.getInstance()
  const userIntegrations = userController.getUserIntegrations(userObjectId.toString())
  
  userIntegrations.startWhatsappIntegration()
    .then(() => {
      return res.status(200).send({
        success: true
      })
    })
    .catch(err => {
      return res.status(500).send({
        error: err
      })
    })

})

export { router as whatsappRouter }