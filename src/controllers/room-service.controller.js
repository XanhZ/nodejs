import { Request, Response } from 'express'
import DAO from '../dao/dao'

class RoomServiceController {
  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async create(req, res) {
    try {
      const data = req.body
      const motel = await DAO.models['Motel'].create({
        province: data.province,
        district: data.district,
        ward: data.ward,
        street: data.street,
        userId: req.user.id
      })

      return res.status(201).send(motel)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async update(req, res) {
    try {
      const data = req.body
      const motel = await DAO.models['Motel'].findByPk(req.params.id)
      if (!motel) return res.sendStatus(404)
      if (motel.userId !== req.user.id) return res.sendStatus(403)

      motel.province = data.province ?? motel.province
      motel.district = data.district ?? motel.district
      motel.ward = data.ward ?? motel.ward
      motel.street = data.street ?? motel.street
      motel.updateAt = Date.now()

      await motel.save()

      return res.status(200).send(motel)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async delete(req, res) {
    try {
      const motel = await DAO.models['Motel'].findByPk(req.params.id)
      if (!motel) return res.sendStatus(404)

      await motel.destroy()

      return res.status(204).send({ message: 'Deleted' })
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }
}

export default RoomServiceController
