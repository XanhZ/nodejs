import { Request, Response } from 'express'
import DAO from '../dao/dao'
import Image from '../helpers/image'

class RoomImageController {
  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async create(req, res) {
    try {
      const uploadedImage = await Image.upload(req.files.image)

      const image = await DAO.models['RoomImage'].create({
        url: uploadedImage.url,
        roomId: req.params.roomId,
        publicId: uploadedImage.fileId
      })

      return res.status(201).send(DAO.models['RoomImage'].serialize(image))
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
      const image = await DAO.models['RoomImage'].findOne({
        where: {
          roomId: req.params.roomId,
          publicId: req.params.publicId
        }
      })

      if (!image) return res.sendStatus(404)

      await Image.delete(req.params.publicId)
      await image.destroy({ force: true })

      return res.sendStatus(204)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }
}

export default RoomImageController
