import express from 'express'

import AuthController from '../controllers/auth.controller'
import MotelController from '../controllers/motel.controller'
import RoomController from '../controllers/room.controller'
import RoomImageController from '../controllers/room-image.controller'
import RoomServiceController from '../controllers/room-service.controller'
import ServiceController from '../controllers/service.controller'

import AdminMiddleware from '../middlewares/admin.middleware'
import AuthMiddleware from '../middlewares/auth.middleware'
import LandlordMiddleware from '../middlewares/landlord.middleware'
import LoggedMiddleware from '../middlewares/logged.middleware'
import RefreshTokenMiddleware from '../middlewares/refreshtoken.middleware'

import LoginValidator from '../validators/login.validator'
import MotelValidator from '../validators/motel.validator'
import RegisterValidator from '../validators/register.validator'
import RoomValidator from '../validators/room.validator'
import RoomServiceValidator from '../validators/room-service.validator'
import ServiceValidator from '../validators/service.validator'
import RoomImageValidator from '../validators/room-image.validator'

const router = express.Router()

const initApiRoute = (app) => {
  router.get('/rooms', RoomController.all)
  router.get('/rooms/:slug', RoomController.findBySlug)

  /**
   * ----------------AUTH ROUTES----------------
   */
  router.post(
    '/auth/register', 
    [LoggedMiddleware.handle, RegisterValidator.validate(), RegisterValidator.getErrors],
    AuthController.register
  )
  router.post(
    '/auth/login', 
    [LoggedMiddleware.handle, LoginValidator.validate(), LoginValidator.getErrors], 
    AuthController.login
  )
  router.post('/auth/refresh-token', RefreshTokenMiddleware.handle, AuthController.refreshToken)
  router.delete('/auth/logout', AuthMiddleware.handle, AuthController.logout)

  /**
   * ----------------SERVICE ROUTES----------------
   */
  router.get(
    '/services', 
    ServiceController.all
  )
  router.post(
    '/services', 
    [AuthMiddleware.handle, AdminMiddleware.handle, ServiceValidator.validateCreate(), ServiceValidator.getErrors], 
    ServiceController.create
  )
  router.put(
    '/services/:id(\\d+)',
    [AuthMiddleware.handle, AdminMiddleware.handle, ServiceValidator.validateUpdate(), ServiceValidator.getErrors], 
    ServiceController.update
  )
  router.delete(
    '/services/:id(\\d+)', 
    [AuthMiddleware.handle, AdminMiddleware.handle], 
    ServiceController.delete
  )

  /**
   * ----------------MOTEL ROUTES----------------
   */
  router.get(
    '/user/motels',
    [AuthMiddleware.handle, LandlordMiddleware.handle],
    MotelController.findByUser
  )
  router.get(
    '/user/motels/:id(\\d+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    MotelController.findById
  )
  router.post(
    '/user/motels', 
    [AuthMiddleware.handle, LandlordMiddleware.handle, MotelValidator.validateCreate(), MotelValidator.getErrors], 
    MotelController.create
  )
  router.put(
    '/user/motels/:id(\\d+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle, MotelValidator.validateUpdate(), MotelValidator.getErrors], 
    MotelController.update
  )
  router.delete(
    '/user/motels/:id(\\d+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    MotelController.delete
  )

  /**
   * ----------------ROOM ROUTES----------------
   */
  router.get(
    '/user/rooms', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.findByUser
  )
  router.get(
    '/user/rooms/:id(\\d+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.findById
  )
  router.get(
    '/user/motels/:motelId(\\d+)/rooms', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.findByMotel
  )
  router.post(
    '/user/motels/:motelId(\\d+)/rooms', 
    [AuthMiddleware.handle, LandlordMiddleware.handle, RoomValidator.validateCreate(), RoomValidator.getErrors], 
    RoomController.create
  )
  router.put(
    '/user/rooms/:id(\\d+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle, RoomValidator.validateUpdate(), RoomValidator.getErrors], 
    RoomController.update
  )
  router.delete(
    '/user/rooms/:id(\\d+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.delete
  )

  /**
   * ----------------ROOM IMAGE ROUTES----------------
   */
  router.post(
    '/user/rooms/:roomId/images', 
    [AuthMiddleware.handle, LandlordMiddleware.handle, RoomImageValidator.validateCreate(), RoomImageValidator.getErrors], 
    RoomImageController.create
  )
  router.delete(
    '/user/rooms/:roomId(\\d+)/images/:publicId(\\w+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomImageController.delete
  )

  /**
   * ----------------ROOM SERVICE ROUTES----------------
   */
  router.post(
    '/user/rooms/:roomId(\\d+)/services', 
    [AuthMiddleware.handle, LandlordMiddleware.handle, RoomServiceValidator.validateCreate(), RoomServiceValidator.getErrors], 
    RoomServiceController.create
  )
  router.put(
    '/user/rooms/:roomId(\\d+)/services/:serviceId(\\d+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle, RoomServiceValidator.validateUpdate(), RoomServiceValidator.getErrors],  
    RoomServiceController.update
  )
  router.delete(
    '/user/rooms/:roomId(\\d+)/services/:serviceId(\\d+)', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomServiceController.delete
  )

  app.use('/api/v1', router)
}

export default initApiRoute
