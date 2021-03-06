const fs = require('fs')
require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    timezone: "+07:00",
    dialectOptions: { bigNumberStrings: true },
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 60000
    }
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    timezone: "+07:00",
    dialectOptions: { bigNumberStrings: true },
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 60000
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    timezone: "+07:00",
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        ca: fs.readFileSync(__dirname + '/../cert/localhost.pem')
      }
    },
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 60000
    }
  }
}
