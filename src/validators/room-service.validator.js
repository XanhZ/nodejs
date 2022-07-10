import { check } from 'express-validator'
import { isNumber } from 'lodash'
import DAO from '../dao/dao'
import Validator from './validator'

class RoomServiceValidator extends Validator {
  static validateCreate() {
    return [
      check('quantity')
        .custom(value => Number.isSafeInteger(value) && value > 0).withMessage('Số lượng phải lớn hơn 0'),
      check('unity')
        .isString().withMessage('Đơn vị không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống đơn vị'),
      check('price')
        .custom(value => isNumber(value) && value > 0)
        .withMessage('Giá phải lớn hơn 0'),
      check('serviceId')
        .custom(value => Number.isSafeInteger(value)).withMessage('Mã dịch vụ không hợp lệ')
        .custom(async value => {
          const count = await DAO.models['Service'].count({
            where: { id: value }
          })
          return count === 1
        })
        .withMessage('Không tồn tại dịch vụ')
    ]
  }

  static validateUpdate() {
    return [
      check('quantity')
        .optional()
        .custom(value => Number.isSafeInteger(value) && value > 0).withMessage('Số lượng phải lớn hơn 0'),
      check('unity')
        .optional()
        .isString().withMessage('Đơn vị không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống đơn vị'),
      check('price')
        .optional()
        .custom(value => isNumber(value) && value > 0)
        .withMessage('Giá phải lớn hơn 0')
    ]
  }
}

export default RoomServiceValidator
