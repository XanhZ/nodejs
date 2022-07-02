import { Request, Response } from 'express'

class AdminMiddleware {
  static #ADMIN = 'admin'
  /**
   * Check if logged user is admin
   * 
   * @param {Request} req Request from client
   * @param {Response} res Response from server
   * @param {callback} next Action call if request is valid
   */
  static handle(req, res, next) {
    if (req.user.role === AdminMiddleware.#ADMIN) return next()
    return res.status(403).send({ message: 'Forbidden' })
  }
}

export default AdminMiddleware
