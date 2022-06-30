import express from 'express'
import AuthController from '../controllers/auth.controller'

const router = express.Router()

const initApiRoute = (app) => {
  router.post('/register', AuthController.register)
  router.post('/login', AuthController.login)
  router.post('/logout', AuthController.logout)

  return app.use('/api/v1/', router)
}

export default initApiRoute