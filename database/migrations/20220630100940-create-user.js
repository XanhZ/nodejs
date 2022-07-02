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
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
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
    await queryInterface.dropTable('users')
  }
}
