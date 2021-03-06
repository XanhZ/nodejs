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
    try {
      const sql = RoomController.#proptertiesToSql(req)
      const rooms = await DAO.sequelize.query(sql, {
        nest: true,
        type: DAO.sequelize.QueryTypes.SELECT
      })
      for (const room of rooms) {
        const [images, services] = await Promise.all([
          DAO.sequelize.query(
            `SELECT url, publicId FROM room_images WHERE room_images.roomId = ${room.id}`,
            {
              nest: true,
              type: DAO.sequelize.QueryTypes.SELECT
            }
          ),
          DAO.sequelize.query(
            'SELECT quantity, unity, price, id as `service.id`, name as `service.name` ' + 
            'FROM room_services, services ' + 
            `WHERE room_services.roomId = ${room.id} AND room_services.serviceId = services.id`,
            {
              nest: true,
              type: DAO.sequelize.QueryTypes.SELECT
            }
          )
        ])
        room.images = images
        room.services = services
      }
      return res.status(200).send(rooms)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  static async create(req, res) {
    try {
      const motelOfRoom = await DAO.models['Motel'].findByPk(req.params.motelId)

      if (!motelOfRoom) {
        return res.sendStatus(400)
      }

      if (req.user.id !== motelOfRoom.userId) {
        return res.sendStatus(403)
      }

      const room = await DAO.models['Room'].create({
        name: req.body.name,
        slug: Slug.slugify(req.body.name),
        type: req.body.type,
        area: req.body.area,
        price: req.body.price,
        deposit: req.body.deposit,
        description: req.body.description,
        motelId: req.params.motelId
      })

      return res.status(201).send(DAO.models['Room'].serialize(room))
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
      const room = await DAO.models['Room'].findByPk(req.params.id)
      if (!room) {
        return res.sendStatus(404)
      }

      const motelOfRoom = await room.getMotel()
      if (req.user.id !== motelOfRoom.userId) {
        return res.sendStatus(403)
      }

      room.name = req.body.name ?? room.name
      room.slug = req.body.name ? Slug.slugify(req.body.name) : room.slug
      room.type = req.body.type ?? room.type
      room.area = req.body.area ?? room.area
      room.price = req.body.price ?? room.price
      room.deposit = req.body.deposit ?? room.deposit
      room.description = req.body.description ?? room.description

      await room.save()

      return res.status(200).send(DAO.models['Room'].serialize(room))
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
      const room = await DAO.models['Room'].findByPk(req.params.id)
      if (!room) {
        return res.sendStatus(404)
      }

      const motelOfRoom = await room.getMotel()
      if (req.user.id !== motelOfRoom.userId) {
        return res.sendStatus(403)
      }

      const images = await DAO.models['RoomImage'].findAll({
        where: { roomId: req.params.id }
      })
      if (images.length > 0) {
        await Image.delete(...images.map(image => image.publicId))
      }
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

      if (!room) {
        return res.sendStatus(404)
      }

      if (room.motel.userId !== req.user.id) {
        return res.sendStatus(403)
      }

      return res.status(200).send(DAO.models['Room'].serialize(room))
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
        where: { slug: req.params.slug },
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
    const motel = await DAO.models['Motel'].findByPk(req.params.motelId)
    if (!motel) {
      return res.sendStatus(400)
    }
    if (motel.userId !== req.user.id) {
      return res.sendStatus(403)
    }
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

  static #proptertiesToSql(req) {
    const properties = ['rooms.motelId = motels.id', 'motels.userId = users.id']
    let orderBy = undefined
    if (req.query.order_by) {
      const arr = req.query.order_by.split('_')
      if (arr[0] === 'price') {
        orderBy = `ORDER BY price ${arr[1]}`
      } else if (arr[0] === 'time') {
        orderBy = `ORDER BY updatedAt`
      }
    }

    if (req.query.district !== undefined) {
      properties.push(`district = '${req.query.district}'`)
    }

    if (req.query.ward !== undefined) {
      properties.push(`ward = '${req.query.ward}'`)
    }

    if (req.query.type !== undefined) {
      properties.push(`type = '${req.query.type}'`)
    }

    if (req.query.area_from !== undefined) {
      properties.push(`area >= ${req.query.area_from}`)
    }

    if (req.query.area_to !== undefined) {
      properties.push(`area <= ${req.query.area_to}`)
    }

    if (req.query.price_from !== undefined) {
      properties.push(`price >= ${req.query.price_from}`)
    }
    
    if (req.query.price_to !== undefined) {
      properties.push(`price <= ${req.query.price_to}`)
    }

    return  'SELECT ' + 
              'rooms.id, ' +
              'rooms.name, ' +
              'rooms.slug, ' +
              'rooms.type, ' +
              'rooms.area, ' +
              'rooms.price, ' +
              'rooms.deposit, ' +
              'rooms.description, ' +
              'rooms.createdAt, ' +
              'rooms.updatedAt, ' +
              'province as `motel.province`, ' +
              'district as `motel.district`, ' +
              'ward as `motel.ward`, ' +
              'street as `motel.street`, ' + 
              'fullname as `motel.landlord.fullname`, ' +
              'phonenumber as `motel.landlord.phonenumber` ' + 
            'FROM rooms, motels, users '+
            `WHERE ${properties.join(' AND ')} ` +
            `${orderBy ? orderBy : ''}`
  }
}

export default RoomController
