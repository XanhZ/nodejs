import Token from '../utils/token'
import { Request, Response } from 'express'

class AuthMiddleware {
  /**
   * Check if user is authorized
   * 
   * @param {Request} req Request from client
   * @param {Response} res Response from server
   * @param {callback} next Action call if request is valid
   */
  static handle(req, res, next) {
    try {
      const authorizationHeader = req.headers['authorization']
      const token = authorizationHeader && authorizationHeader.split(' ')[1]
      if (!token) {
        return res.status(401).send({ message: 'Unauthorized' })
      }
      Token.vertify(token)
      req.accessToken = token
      return next()
    } catch (error) {
      if (error.name === Token.TOKEN_EXPIRED_ERROR) {
        return res.status(403).send({
          message: 'Token is expired',
          expiredAt: error.expiredAt
        })
      }
      if (error.name === Token.JSON_WEB_TOKEN_ERROR) {
        return res.status(401).send({ message: 'Invalid Token' })
      }
    }
  }
}

export default AuthMiddleware
