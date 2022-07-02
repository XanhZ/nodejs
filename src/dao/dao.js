const { Sequelize, DataTypes } = require('sequelize')
const fs = require('fs')
const env = process.env.NODE_ENV || 'development'
const config = require('../../database/config.js')[env]

class DAO {
  static sequelize
  static models = {}

  /**
   * Establish new connection to database and create DAO for each model
   */
  static connect() {
    if (DAO.sequelize === undefined || DAO.sequelize === null) {
      try {
        if (config.use_env_variable) {
          DAO.sequelize = new Sequelize(process.env[config.use_env_variable], config)
        } else {
          DAO.sequelize = new Sequelize(config.database, config.username, config.password, config)
        }
    
        // Load models
        fs
          .readdirSync(__dirname + '/../models')
          .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
          .forEach(file => {
            const model = require(__dirname + '/../models/' + file)(DAO.sequelize, DataTypes)
            DAO.models[model.name] = model
          })
    
        // Load relationship between each models
        Object.keys(DAO.models).forEach(modelName => {
          if (DAO.models[modelName].associate) {
            DAO.models[modelName].associate(DAO.models);
          }
        })

        console.log('-------Connection has been established successfully-------')
      } catch (error) {
        console.log(error)
      }
      return
    }
    console.log('-------Connection has been established yet-------')
  }

  /**
   * Test connection to database
   */
  static async testConnection() {
    try {
      await DAO.sequelize.authenticate()
      console.log('-------Connection has been established successfully-------')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  }
}

export default DAO