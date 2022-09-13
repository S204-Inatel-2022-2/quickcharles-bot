import { NextFunction, Request, Response } from "express";
import { verifyUserToken, parseToken } from "../controllers/usersController";
import { User } from "../models/user";

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if(token) {
    const parsedToken = parseToken(token)
    const payload = verifyUserToken(parsedToken)
    if(payload) {
      const ref = await User.findOne({token: parsedToken})
      res.locals.userObjectId = ref?._id
      return next()
    } else {
      return res.status(403).send({error: 'invalid authorization token'})
    }
  } else {
    return res.status(403).send({error: 'missing authorization token'})
  }
}

export { authenticationMiddleware } 