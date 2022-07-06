import { Request, Response } from 'express'
import DAO from '../dao/dao'

class RoomServiceController {
  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async create(req, res) {
    try {
      const roomService = await DAO.models['RoomService'].create({
        quantity: req.body.quantity,
        price: req.body.price,
        unity: req.body.unity,
        roomId: req.params.roomId,
        serviceId: req.body.serviceId
      })
      roomService.service = await roomService.getService()

      return res.status(201).send(DAO.models['RoomService'].serialize(roomService))
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
      const roomService = await DAO.models['RoomService'].findOne({
        where: {
          roomId: req.params.roomId,
          serviceId: req.params.serviceId
        },
        include: {
          model: DAO.models['Service'],
          as: 'service'
        }
      })

      if (!roomService) {
        return res.sendStatus(404)
      }
      
      roomService.quantity = req.body.quantity ?? roomService.quantity
      roomService.price = req.body.price ?? roomService.price
      roomService.unity = req.body.unity ?? roomService.unity

      await roomService.save()

      return res.status(200).send(DAO.models['RoomService'].serialize(roomService))
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
      const roomService = await DAO.models['RoomService'].findOne({
        where: {
          roomId: req.params.roomId,
          serviceId: req.params.serviceId
        }
      })

      if (!roomService) {
        return res.sendStatus(404)
      }

      await roomService.destroy({ force: true })

      return res.sendStatus(204)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }
}

export default RoomServiceController
