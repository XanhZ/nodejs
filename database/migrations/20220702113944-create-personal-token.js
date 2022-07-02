'use strict'

module.exports = {
  /**
   * Run migration up
   * 
   * @param {QueryInterface} queryInterface 
   * @param {Sequelize} Sequelize 
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('personal_tokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      accessToken: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      lastUsedAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    await queryInterface.dropTable('personal_tokens')
  }
}
