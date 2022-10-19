import { NextFunction, Request, Response } from "express";
import { verifyUserToken, parseToken } from "../controllers/authenticationController";
import { User } from "../models/user";
import { parseDatabaseError } from "../utils/databaseUtils";

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if(token) {
    const parsedToken = parseToken(token)
    const payload = verifyUserToken(parsedToken)
    if(payload) {
      User.findOne({token: parsedToken}).exec()
        .then(ref => {
          if(ref) {
            res.locals.userObjectId = ref?._id
            return next()
          } else {
            return res.status(403).send({error: 'token does not match any user'})
          }
        })
        .catch(err => {
          const { statusCode, responseJson } = parseDatabaseError(err)
          return res.status(statusCode).json(responseJson)
        })
    } else {
      return res.status(403).send({error: 'invalid authorization token'})
    }
  } else {
    return res.status(403).send({error: 'missing authorization token'})
  }
}

export { authenticationMiddleware } 