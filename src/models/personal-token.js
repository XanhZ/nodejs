'use strict';
const { Model, Sequelize } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PersonalToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonalToken.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lastUsedAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'PersonalToken',
    tableName: 'personal_tokens',
  })

  return PersonalToken
}
