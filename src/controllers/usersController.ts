import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

const secretKey = 'salvedog'

interface IUserTokenPayload extends JwtPayload {
  name: string;
}

const createUserToken = (userTokenPayload: IUserTokenPayload) => {
  const token = jwt.sign(userTokenPayload, secretKey)
  return token
}

const parseToken = (token: string) => {
  return token.match('Bearer ') ? token.replace('Bearer ', '') : ''
}

const verifyUserToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey)
  } catch(err) {
    if(err instanceof JsonWebTokenError)
      return false
    throw err
  }
}

export {
  createUserToken,
  verifyUserToken,
  parseToken
}