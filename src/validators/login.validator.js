import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

class LoginValidator {
  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next
   */
  static validate() {
    return [
      body('username').isString().trim().notEmpty(),
      body('password').isString().trim().notEmpty()
    ]
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next
   */
  static getErrors(req, res, next) {
    const errors = validationResult(req)
    return errors.isEmpty() ? next() : res.status(401).send({message: 'Tên đăng nhập hoặc mật khẩu không đúng'})
  }
}

export default LoginValidator
