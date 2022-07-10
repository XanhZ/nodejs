import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

class Validator {
  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @param {callback} custom
   */
  static getErrors(req, res, next) {
    const errors = validationResult(req)
    return errors.isEmpty() ? next() : res.status(422).send(errors.mapped())
  }
}

export default Validator
