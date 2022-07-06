import { Request, Response } from 'express'
import DAO from '../dao/dao'
import Image from '../helpers/image'
import Slug from '../helpers/slug'

class RoomController {
  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async all(req, res) {
    const rooms = await DAO.models['Room'].findAll({
      include: [{
        model: DAO.models['RoomImage'],
        as: 'images'
      }, {
        model: DAO.models['Motel'],
        as: 'motel',
        include: { model: DAO.models['User'], as: 'landlord' }
      }, {
        model: DAO.models['RoomService'],
        as: 'services',
        include: { model: DAO.models['Service'], as: 'service' }
      }]
    })
    res.status(200).send(DAO.models['Room'].serializeMany(rooms))
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async create(req, res) {
    try {
      const uploadImages = await Image.uploadMulti(req.files.images)

      const [createdRoom, images] = await DAO.sequelize.transaction(async (trans) => {

        const room = await DAO.models['Room'].create({
          name: req.body.name,
          slug: Slug.slugify(req.body.name),
          type: req.body.type,
          area: req.body.area,
          price: req.body.price,
          deposit: req.body.deposit,
          description: req.body.description,
          motelId: req.params.motelId
        }, { transaction: trans })

        const services = await Promise.all(JSON.parse(req.body.services).map(
          service => DAO.models['RoomService'].create({
            quantity: service.quantity,
            price: service.price,
            unity: service.unity,
            serviceId: service.serviceId,
            roomId: room.id
          }, { transaction: trans })
        ))

        const images = await Promise.all(uploadImages.map(
          image => DAO.models['RoomImage'].create({
            url: image.url,
            publicId: image.fileId,
            roomId: room.id
          }, { transaction: trans })
        ))

        return [room, images]
      })

      return res.status(201).send({
        ...DAO.models['Room'].serialize(createdRoom),
        images: DAO.models['RoomImage'].serializeMany(images)
      })
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

  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async delete(req, res) {
    try {
      const room = await DAO.models['Room'].findByPk(req.params.id)

      if (!room) return res.sendStatus(404)

      const images = await DAO.models['RoomImage'].findAll({
        where: { roomId: req.params.id }
      })

      await Image.delete(...images.map(image => image.publicId))
      await room.destroy({ force: true })

      return res.sendStatus(204)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async findById(req, res) {
    try {
      const room = await DAO.models['Room'].findByPk(req.params.id, {
        include: [{
          model: DAO.models['RoomImage'],
          as: 'images',
        }, {
          model: DAO.models['Motel'],
          as: 'motel',
        }, {
          model: DAO.models['RoomService'],
          as: 'services',
          include: { model: DAO.models['Service'], as: 'service' }
        }]
      })

      return !room ? res.sendStatus(404) : res.status(200).send(DAO.models['Room'].serialize(room))
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async findBySlug(req, res) {
    try {
      const room = await DAO.models['Room'].findOne({
        where: { slug: req.body.slug },
        include: [{
          model: DAO.models['RoomImage'],
          as: 'images'
        }, {
          model: DAO.models['Motel'],
          as: 'motel',
          include: { model: DAO.models['User'], as: 'landlord' }
        }, {
          model: DAO.models['RoomService'],
          as: 'services',
          include: { model: DAO.models['Service'], as: 'service' }
        }]
      })

      return !room ? res.sendStatus(404) : res.status(200).send(DAO.models['Room'].serialize(room))
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async findByMotel(req, res) {
    const rooms = await DAO.models['Room'].findAll({
      where: { motelId: req.params.motelId },
      include: [{
        model: DAO.models['RoomImage'],
        as: 'images',
      }, {
        model: DAO.models['Motel'],
        as: 'motel',
      }, {
        model: DAO.models['RoomService'],
        as: 'services',
        include: { model: DAO.models['Service'], as: 'service' },
      }]
    })
    res.status(200).send(DAO.models['Room'].serializeMany(rooms))
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async findByUser(req, res) {
    const results = await DAO.sequelize.query(
      `SELECT id FROM motels WHERE userId = ${req.user.id}`,
      { type: DAO.sequelize.QueryTypes.SELECT }
    )

    const rooms = await DAO.models['Room'].findAll({
      where: { 
        motelId: results.map(result => result.id) 
      },
      include: [{
        model: DAO.models['RoomImage'],
        as: 'images',
      }, {
        model: DAO.models['Motel'],
        as: 'motel',
      }, {
        model: DAO.models['RoomService'],
        as: 'services',
        include: { model: DAO.models['Service'], as: 'service' },
      }]
    })
    res.status(200).send(DAO.models['Room'].serializeMany(rooms))
  }
}

export default RoomController
