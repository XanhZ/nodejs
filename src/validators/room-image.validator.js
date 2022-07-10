import { check } from 'express-validator'
import Regex from '../helpers/regex'
import Validator from './validator'

class RoomImageValidator extends Validator {
  static validateCreate() {
    return [
      check('image')
        .custom((value, { req }) => {
          const image = req.files.image
          return !Array.isArray(image)
        }).withMessage('Số lượng hình ảnh phải là 1')
        .custom((value, {req}) => {
          const image = req.files.image
          return Regex.IMAGE_FILENAME.test(image.name)
        }).withMessage('Hình ảnh không hợp lệ')
    ]
  }
}

export default RoomImageValidator
