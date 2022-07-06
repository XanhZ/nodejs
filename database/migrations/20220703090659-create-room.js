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
    await queryInterface.createTable('rooms', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      area: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      deposit: {
        type: Sequelize.FLOAT,
      },
      description: {
        type: Sequelize.TEXT('medium'),
        allowNull: false,
      },
      motelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'motels',
          key: 'id'
        },
        onDelete: 'cascade'
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
    await queryInterface.dropTable('rooms')
  }
}
