import { body } from 'express-validator'
import Regex from '../helpers/regex'
import Validator from './validator'

class RegisterValidator extends Validator {
  static validate() {
    return [
      body('fullname')
        .isString().withMessage('Họ tên không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống họ tên'),
      body('phonenumber')
        .isString().withMessage('Số điện thoại không hợp lệ')
        .trim()
        .matches(Regex.PHONENUMBER).withMessage('Số điện thoại không hợp lệ'),
      body('username')
        .isString().withMessage('Tài khoản không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống tên đăng nhập')
        .isLength({ min: 8 }).withMessage('Tên đăng nhập phải từ 8 ký tự trở lên'),
      body('password')
        .isString().withMessage('Mật khẩu không hợp lệ')
        .trim()
        .notEmpty().withMessage('Không được bỏ trống mật khẩu')
        .isStrongPassword().withMessage('Mật khẩu phải từ 8-32 kí tự bao gồm cả chữ hoa, chữ thường, chữ số và kí tự đặc biệt'),
      body('role')
        .notEmpty().withMessage('Không được bỏ trống vai trò')
        .isIn(['landlord', 'user']).withMessage('Vai trò không hợp lệ')
    ]
  }
}

export default RegisterValidator
