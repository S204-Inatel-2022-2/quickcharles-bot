import { NextFunction, Request, Response } from "express";
import { verifyUserToken, IUserTokenPayload } from "../controllers/usersController";
import { User } from "../models/user";

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  const payload = verifyUserToken(token)
  if(payload) {
    const ref = User.find({token: token})
    // res.locals.userObjectId = ref._id
    return next()
  } else {
    return res.status(403)
  }
}

export { authenticationMiddleware } 