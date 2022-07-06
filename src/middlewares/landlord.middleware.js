import { Request, Response } from 'express'

class LandlordMiddlware {
  static #LANDLORD = 'landlord'
  /**
   * Check if logged user is landlord
   * 
   * @param {Request} req Request from client
   * @param {Response} res Response from server
   * @param {callback} next Action call if request is valid
   */
  static handle(req, res, next) {
    return req.user.role === LandlordMiddlware.#LANDLORD ? next() : res.status(403).send({ message: 'Forbidden' })
  }
}

export default LandlordMiddlware
