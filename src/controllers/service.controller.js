import { Request, Response } from 'express'
import DAO from '../dao/dao'

class ServiceController {
  /**
   * @param {Request} req
   * @param {Response} res
   */
  static async all(req, res) {
    try {
      const services = await DAO.models['Service'].findAll()
      res.status(200).send(services)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }

  /**
   * @param {Request} req
   * @param {Response} res
   */
  static async create(req, res) {
    try {
      const service = await DAO.models['Service'].create({
        name: req.body.name,
        description: req.body.description
      })

      return res.status(201).send(service)
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
      const service = await DAO.models['Service'].findByPk(req.params.id)
      if (!service) return res.sendStatus(404)

      service.name = data.name ?? service.name
      service.description = data.description ?? service.description
      service.updateAt = Date.now()

      await service.save()

      return res.status(200).send(service)
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
      const service = await DAO.models['Service'].findByPk(req.params.id)
      if (!service) return res.sendStatus(404)

      await service.destroy()

      return res.sendStatus(204)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }
}

export default ServiceController
