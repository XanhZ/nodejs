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

const router = express.Router()

const initApiRoute = (app) => {
  router.get('/rooms', RoomController.all)
  router.get('/rooms/:slug', RoomController.findBySlug)

  /**
   * ----------------AUTH ROUTES----------------
   */
  router.post('/auth/register', LoggedMiddleware.handle, AuthController.register)
  router.post('/auth/login', LoggedMiddleware.handle, AuthController.login)
  router.post('/auth/refresh-token', RefreshTokenMiddleware.handle, AuthController.refreshToken)
  router.delete('/auth/logout', AuthMiddleware.handle, AuthController.logout)

  /**
   * ----------------SERVICE ROUTES----------------
   */
  router.get('/services', [AuthMiddleware.handle, AdminMiddleware.handle], ServiceController.all)
  router.post('/services', [AuthMiddleware.handle, AdminMiddleware.handle], ServiceController.create)
  router.put('/services/:id', [AuthMiddleware.handle, AdminMiddleware.handle], ServiceController.update)
  router.delete('/services/:id', [AuthMiddleware.handle, AdminMiddleware.handle], ServiceController.delete)

  /**
   * ----------------MOTEL ROUTES----------------
   */
  router.get(
    '/user/motels',
    [AuthMiddleware.handle, LandlordMiddleware.handle],
    MotelController.findByUser
  )
  router.get(
    '/user/motels/:id', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    MotelController.findById
  )
  router.post(
    '/user/motels', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    MotelController.create
  )
  router.put(
    '/user/motels/:id', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    MotelController.update
  )
  router.delete(
    '/user/motels/:id', 
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
    '/user/rooms/:id', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.findById
  )
  router.get(
    '/user/motels/:motelId/rooms', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.findByMotel
  )
  router.post(
    '/user/motels/:motelId/rooms', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.create
  )
  router.put(
    '/user/rooms/:id', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.update
  )
  router.delete(
    '/user/rooms/:id', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomController.delete
  )

  /**
   * ----------------ROOM IMAGE ROUTES----------------
   */
  router.post(
    '/user/rooms/:roomId/images', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomImageController.create
  )
  router.delete(
    '/user/rooms/:roomId/images/:publicId', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomImageController.delete
  )

  /**
   * ----------------ROOM SERVICE ROUTES----------------
   */
  router.post(
    '/user/rooms/:roomId/services', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomServiceController.create
  )
  router.put(
    '/user/rooms/:roomId/services/:serviceId', 
    [AuthMiddleware.handle, LandlordMiddleware.handle],  
    RoomServiceController.update
  )
  router.delete(
    '/user/rooms/:roomId/services/:serviceId', 
    [AuthMiddleware.handle, LandlordMiddleware.handle], 
    RoomServiceController.delete
  )

  app.use('/api/v1', router)
}

export default initApiRoute
