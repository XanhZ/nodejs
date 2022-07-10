import { body } from 'express-validator'
import { isNumber } from 'lodash'
import Validator from './validator'

class RoomValidator extends Validator {

  static validateCreate() {
    return [
      body('name')
        .isString().withMessage('Tên phòng không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống tên phòng'),
      body('type')
        .notEmpty().withMessage('Không được bỏ trống loại phòng')
        .isIn(['CCMN', 'Phòng trọ']).withMessage('Loại phòng không hợp lệ'),
      body('area')
        .notEmpty().withMessage('Không được bỏ trống diện tích')
        .custom(value => isNumber(value) && value > 0).withMessage('Diện tích phải là số dương'),
      body('price')
        .notEmpty().withMessage('Không được bỏ trống giá')
        .custom(value => isNumber(value) && value > 0).withMessage('Giá phải là số dương'),
      body('deposit')
        .optional()
        .custom(value => isNumber(value) && value > 0).withMessage('Tiền cọc phải là số dương'),
      body('description')
        .isString().withMessage('Mô tả không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống mô tả phòng')
    ]
  }

  static validateUpdate() {
    return [
      body('name')
        .optional()
        .isString().withMessage('Tên phòng không hợp lệ')
        .trim()
        .notEmpty().withMessage('Tên phòng không hợp lệ'),
      body('type')
        .optional()
        .isIn(['CCMN', 'Phòng trọ']).withMessage('Loại phòng không hợp lệ'),
      body('area')
        .optional()
        .custom(value => isNumber(value) && value > 0).withMessage('Diện tích phải là số dương'),
      body('price')
        .optional()
        .custom(value => isNumber(value) && value > 0).withMessage('Giá phải là số dương'),
      body('deposit')
        .optional()
        .custom(value => isNumber(value) && value > 0).withMessage('Tiền cọc phải là số dương'),
      body('description')
        .optional()
        .isString().withMessage('Mô tả không hợp lệ')
        .trim()
        .notEmpty().withMessage('Mô tả không hợp lệ')
    ]
  }
}

export default RoomValidator
