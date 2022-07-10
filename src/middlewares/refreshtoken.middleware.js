import { Request, Response, NextFunction } from 'express'
import Token from '../helpers/token'

class RefreshTokenMiddleware {
  /**
   * Handle incoming request
   * 
   * @param {Request} req Request from client
   * @param {Response} res Response from server
   * @param {NextFunction} next Action call if request is valid
   */
  static handle(req, res, next) {
    try {
      const token = req.body.refreshToken
      if (!token) {
        return res.status(401).send({ message: 'Unauthorized' })
      }

      req.user = Token.vertify(token, true)
      return next()
    } catch (error) {
      if (error.name === Token.ERRORS.TOKEN_EXPIRED) {
        return res.status(403).send({
          message: 'Token is expired',
          expriredAt: error.expriredAt
        })
      }
      
      if (error.name === Token.ERRORS.JSON_WEB_TOKEN) {
        return res.status(401).send({ message: 'Invalid Token' })
      }
    }
  }
}

export default RefreshTokenMiddleware
