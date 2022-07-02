import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import DAO from './dao/dao'
import initApiRoute from './routes/api'

dotenv.config()

const app = express()
const port = process.env.APP_PORT || 3000

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initApiRoute(app)

DAO.connect()

app.listen(port, () => console.log(`-------Server started on port ${port}-------`))
