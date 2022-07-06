'use strict'

const { QueryInterface, Sequelize } = require('sequelize')

module.exports = {
  /**
   * Run migration up
   * 
   * @param {QueryInterface} queryInterface 
   * @param {Sequelize} Sequelize 
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('services', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT('tiny')
      },
      createdAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },
  
  /**
   * Run migration down
   * 
   * @param {QueryInterface} queryInterface 
   * @param {Sequelize} Sequelize 
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('services')
  }
}
