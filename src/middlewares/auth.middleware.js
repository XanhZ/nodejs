import Token from '../helpers/token'
import { Request, Response, NextFunction } from 'express'

class AuthMiddleware {
  /**
   * Check if user is authorized
   * 
   * @param {Request} req Request from client
   * @param {Response} res Response from server
   * @param {NextFunction} next Action call if request is valid
   */
  static handle(req, res, next) {
    try {
      const authorizationHeader = req.headers['authorization']
      const token = authorizationHeader && authorizationHeader.split(' ')[1]

      if (!token) {
        return res.status(401).send({ message: 'Unauthorized' })
      }

      req.user = Token.vertify(token)
      req.accessToken = token

      return next()
    } catch (error) {
      if (error.name === Token.ERRORS.TOKEN_EXPIRED) {
        return res.status(403).send({
          message: 'Token is expired',
          expiredAt: error.expiredAt
        })
      }
      
      if (error.name === Token.ERRORS.JSON_WEB_TOKEN) {
        return res.status(401).send({ message: 'Invalid Token' })
      }
    }
  }
}

export default AuthMiddleware
