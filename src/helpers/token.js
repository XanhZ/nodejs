import { sign, verify } from 'jsonwebtoken'

class Token {
  static #ERRORS = Object.freeze({
    TOKEN_EXPIRED: 'TokenExpiredError',
    JSON_WEB_TOKEN: 'JsonWebTokenError',
  })

  static get ERRORS() {
    return Token.#ERRORS
  }
  
  /**
   * Generate access token of payload
   * 
   * @param {any} payload Payload need to be signed
   * @returns Access token and refresh token
   */
  static generate(payload) {
    const accessToken = sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    )
    const refreshToken = sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    )
    return { accessToken, refreshToken }
  }
  
  /**
   * Check if token is valid
   * 
   * @param {string} token Token need to be vertified
   * @param {boolean} isRefresh Is refresh token or not, default is false
   * @returns Decoded token
   */
  static vertify(token, isRefresh=false) {
    return verify(token, isRefresh ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET)
  }
}

export default Token
