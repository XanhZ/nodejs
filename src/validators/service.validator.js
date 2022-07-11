import { body } from 'express-validator'
import Validator from './validator'

class ServiceValidator extends Validator {
  static validateCreate() {
    return [
      body('name')
        .isString().withMessage('Tên dịch vụ không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống tên dịch vụ'),
      body('description')
        .optional()
        .isString().withMessage('Mô tả không hợp lệ')
        .trim(),
    ]
  }

  static validateUpdate() {
    return [
      body('name')
        .optional()
        .isString().withMessage('Tên dịch vụ không hợp lệ')
        .trim()
        .notEmpty().withMessage('Tên dịch vụ không hợp lệ'),
      body('description')
        .optional()
        .isString().withMessage('Mô tả không hợp lệ')
        .trim()
        .notEmpty().withMessage('Mô tả không hợp lệ'),
    ]
  }
}

export default ServiceValidator
