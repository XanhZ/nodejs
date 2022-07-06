'use strict'

const { Model } = require('sequelize')
const Serializer = require('../helpers/serializer').default

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static #scheme = {
      include: ['@all'],
    }

    static associate(models) {
      this.hasMany(models['RoomService'], { as: 'service', foreignKey: 'serviceId' })
    }

    static serializeMany(instances, options) {
      return Serializer.serializeMany(instances, this, Service.#scheme, options)
    }

    static serialize(instance, options) {
      return (new Serializer(this, Service.#scheme, options)).serialize(instance)
    }
  }

  Service.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT('tiny')
    },
  }, {
    sequelize,
    modelName: 'Service',
    tableName: 'services',
  })

  return Service
}