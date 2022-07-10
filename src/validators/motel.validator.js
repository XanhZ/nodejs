import { body } from 'express-validator'
import Validator from './validator'

class MotelValidator extends Validator {
  static validateCreate() {
    return [
      body('province')
        .isString().withMessage('Tỉnh/Thành phố không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống Tỉnh/Thành phố'),
      body('district')
        .isString().withMessage('Quận/Huyện không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống Quận/Huyện'),
      body('ward')
        .isString().withMessage('Xã/Phường không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống Xã/Phường'),
      body('street')
        .isString().withMessage('Số nhà/Phố không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống Số nhà/phố'),
    ]
  }

  static validateUpdate() {
    return [
      body('province')
        .optional()
        .isString().withMessage('Tỉnh/Thành phố không hợp lệ')
        .trim()
        .notEmpty().withMessage('Tỉnh/Thành phố không hợp lệ'),
      body('district')
        .optional()
        .isString().withMessage('Quận/Huyện không hợp lệ')
        .trim()
        .notEmpty().withMessage('Quận/Huyện không hợp lệ'),
      body('ward')
        .optional()
        .isString().withMessage('Xã/Phường không hợp lệ')
        .trim()
        .notEmpty().withMessage('Xã/Phường không hợp lệ'),
      body('street')
        .optional()
        .isString().withMessage('Số nhà/Phố không hợp lệ')
        .trim()
        .notEmpty().withMessage('Số nhà/Phố không hợp lệ'),
    ]
  }
}

export default MotelValidator
