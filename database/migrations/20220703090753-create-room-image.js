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
    await queryInterface.createTable('room_images', {
      url: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      roomId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'rooms',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      publicId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    })
  },

  /**
   * Run migration down
   * 
   * @param {QueryInterface} queryInterface 
   * @param {Sequelize} Sequelize 
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('room_images')

  }
}
