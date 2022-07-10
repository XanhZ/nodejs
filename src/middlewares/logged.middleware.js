import { Request, Response, NextFunction } from 'express'

class LoggedMiddleware {
  /**
   * Check if user has logged or not
   * 
   * @param {Request} req Request from client
   * @param {Response} res Response from server
   * @param {NextFunction} next Action call if request is valid
   */
  static handle(req, res, next) {
    return !req.headers['authorization'] ? next() : res.status(403).send({ message: 'Forbidden' })
  }
}

export default LoggedMiddleware
