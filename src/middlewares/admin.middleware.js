import { Request, Response, NextFunction } from 'express'

class AdminMiddleware {
  static #ADMIN = 'admin'
  /**
   * Check if logged user is admin
   * 
   * @param {Request} req Request from client
   * @param {Response} res Response from server
   * @param {NextFunction} next Action call if request is valid
   */
  static handle(req, res, next) {
    return req.user.role === AdminMiddleware.#ADMIN ? next() : res.status(403).send({ message: 'Forbidden' })
  }
}

export default AdminMiddleware
