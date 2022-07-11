const { Sequelize, DataTypes, Op } = require('sequelize')
const fs = require('fs')
const env = process.env.NODE_ENV || 'development'
const config = require('../../database/config.js')[env]

class DAO {
  static sequelize
  static models = {}
  static operator = Op

  /**
   * Establish new connection to database and create DAO for each model
   */
  static async connect() {
    if (this.sequelize === undefined || this.sequelize === null) {
      try {
        this.sequelize = new Sequelize(config.database, config.username, config.password, config)
        await this.testConnection()
        this.#initalizeModels()
      } catch (error) {
        console.log(error)
      }
      return
    }
    console.log('-------Connection to database has been established yet-------')
  }

  /**
   * Test connection to database
   */
  static async testConnection() {
    try {
      console.log('-------Authenticating database connection-------')
      await this.sequelize.authenticate()
      console.log('-------Connection to database has been established successfully-------')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  }

  /**
   * Close all connection
   */
  static async closeConnection() {
    await this.sequelize.close()
    console.log('-------Connection to database has been closed-------')
  }

  /**
   * Load models and their relationships between them
   */
  static #initalizeModels() {
    const regexJsFilename = /[\w-]+.js/
    fs
      .readdirSync(__dirname + '/../models')
      .filter(filename => regexJsFilename.test(filename))
      .forEach(filename => {
        const model = require(__dirname + '/../models/' + filename)(this.sequelize, DataTypes)
        this.models[model.name] = model
      })
    Object.keys(this.models).forEach(modelName => {
      if (this.models[modelName].associate) {
        this.models[modelName].associate(this.models)
      }
    })
  }
}

export default DAO
