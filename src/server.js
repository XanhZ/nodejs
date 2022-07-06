import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'

import DAO from './dao/dao'
import initApiRoute from './routes/api'
import initWebRoute from './routes/web'

dotenv.config()

const app = express()
const port = process.env.APP_PORT || 3000

app.use(compression({
  level: 6,
  threshold: 100 * 1000, // 100 kB
  filter: (req, res) => {
    return req.headers['x-no-compress'] ? false : compression.filter(req, res)
  }
}))
app.use(fileUpload({
  limits: { fieldSize: 2 * 1024 * 1024 } // 2 MB / image
}))
app.use(morgan('combined'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initWebRoute(app)
initApiRoute(app)

DAO.connect()

app.listen(port, () => console.log(`-------Server started on port ${port}-------`))
