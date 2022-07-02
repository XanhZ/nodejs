import { Request, Response } from 'express'
import DAO from '../dao/dao'
import Password from '../helpers/password'
import Token from '../helpers/token'

class AuthController {
  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async register(req, res) {
    try {
      const data = req.body
      // Check if username is exist or not
      if (await AuthController.#isExist(data.username)) {
        return res.status(409).send({ message: 'Tên đăng nhập đã tồn tại' })
      }
      // Create new user
      await DAO.models['User'].create({
        fullname: data.fullname,
        username: data.username,
        password: Password.hash(data.password),
      })
      return res.status(201).send({ message: 'Register successfully' })
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async login(req, res) {
    const data = req.body
    const user = await DAO.models['User'].findOne({
      attributes: ['id', 'fullname', 'password', 'role'],
      where: { username: data.username },
    })

    if (user && Password.check(data.password, user.password)) {
      const tokens = Token.generate({
        id: user.id,
        fullname: user.fullname,
        role: user.role
      })
      try {
        DAO.models['PersonalToken'].create(tokens)
        return res.status(200).send({
          ...tokens,
          user: user
        })
      } catch (error) {
        console.log(error)
        return res.sendStatus(500)
      }
    }

    return res.status(401).send({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' })
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async logout(req, res) {
    // Delete token in database
    try {
      await DAO.models['PersonalToken'].destroy({
        where: { accessToken: req.accessToken },
        force: true
      })
      return res.sendStatus(204)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async refreshToken(req, res) {
    try {
      const personalToken = await DAO.models['PersonalToken'].findOne({
        where: { refreshToken: req.body.refreshToken }
      })
      if (!personalToken) return res.status(403).send({ message: 'Forbidden' })
      const newTokens = Token.generate({
        id: req.user.id,
        fullname: req.user.fullname,
        role: req.user.role
      })
      personalToken.accessToken = newTokens.accessToken
      personalToken.refreshToken = newTokens.refreshToken
      personalToken.lastUsedAt = personalToken.updatedAt = Date.now()
      await personalToken.save()
      return res.status(201).send(newTokens)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  /**
   * @param {string} username username need to check if there is one in database
   * @returns true if username has existed else false
   */
  static async #isExist(username) {
    const count = await DAO.models['User'].count({ where: { username: username } })
    return count !== 0
  }
}

export default AuthController
