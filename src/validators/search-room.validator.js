import { query, validationResult } from 'express-validator'
import Regex from '../helpers/regex'

class SearchRoomValidator {
  static validate() {
    return [
      query('order_by')
        .optional()
        .isIn(['price_asc', 'price_desc', 'time_newest'])
        .withMessage('Sắp xếp không hợp lệ'),
      query('district')
        .optional()
        .isString().withMessage('Quận/Huyện không hợp lệ')
        .custom(value => !Regex.SPECIAL_CHAR.test(value)).withMessage('Quận/Huyện không được chứa kí tự đặc biệt'),
      query('ward')
        .optional()
        .isString().withMessage('Xã/Phường không hợp lệ')
        .custom(value => !Regex.SPECIAL_CHAR.test(value)).withMessage('Xã/Phường không được chứa kí tự đặc biệt'),
      query('type')
        .optional()
        .isIn(['Phòng trọ', 'CCMN']).withMessage('Loại phòng không hợp lệ'),
      query('area_from')
        .optional()
        .isNumeric().withMessage('Diện tích từ không hợp lệ'),
      query('area_to')
        .optional()
        .isNumeric().withMessage('Diện tích đến không hợp lệ'),
      query('price_from')
        .optional()
        .isNumeric().withMessage('Giá từ không hợp lệ'),
      query('price_to')
        .optional()
        .isNumeric().withMessage('Giá đến không hợp lệ'),
    ]
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @param {callback} custom
   */
   static getErrors(req, res, next) {
    const errors = validationResult(req)
    return errors.isEmpty() ? next() : res.status(400).send(errors.mapped())
  }
}

export default SearchRoomValidator
