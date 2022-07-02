import express from 'express'
import AuthController from '../controllers/auth.controller'
import AuthMiddleware from '../middlewares/auth.middleware'
import LoggedMiddleware from '../middlewares/logged.middleware'
import RefreshTokenMiddleware from '../middlewares/refreshtoken.middleware'

const router = express.Router()

const initApiRoute = (app) => {
  router.post('/auth/register', LoggedMiddleware.handle, AuthController.register)
  router.post('/auth/login', LoggedMiddleware.handle, AuthController.login)

  router.post('/auth/refresh-token', RefreshTokenMiddleware.handle, AuthController.refreshToken)
  
  router.delete('/auth/logout', AuthMiddleware.handle, AuthController.logout)

  app.use('/api/v1', router)
}

export default initApiRoute
