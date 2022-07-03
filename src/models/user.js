'use strict'

const { Model } = require('sequelize')
const Serializer = require('../helpers/serializer').default

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static #scheme = {
      include: ['@all'],
      exclude: ['password', '@auto'],
    }

    static associate(models) {

    }

    static serializeMany(instances, options) {
      return Serializer.serializeMany(instances, this, User.#scheme, options)
    }

    static serialize(instance, options) {
      return (new Serializer(this, User.#scheme, options)).serialize(instance)
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  })

  return User
}
