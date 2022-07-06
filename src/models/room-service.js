'use strict'

const { Model } = require('sequelize')
const Serializer = require('../helpers/serializer').default

module.exports = (sequelize, DataTypes) => {
  class RoomService extends Model {
    static #scheme = {
      include: ['@all', 'service'],
      exclude: ['@fk'],
      assoc: {
        service: {
          include: ['id', 'name'],
        }
      }
    }

    static associate(models) {
      this.belongsTo(models['Room'], { as: 'room', foreignKey: 'roomId' })
      this.belongsTo(models['Service'], { as: 'service', foreignKey: 'serviceId' })
    }

    static serializeMany(instances, options) {
      return Serializer.serializeMany(instances, this, RoomService.#scheme, options)
    }

    static serialize(instance, options) {
      return (new Serializer(this, RoomService.#scheme, options)).serialize(instance)
    }
  }

  RoomService.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'services',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'rooms',
        key: 'id',
      },
      onDelete: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'RoomService',
    tableName: 'room_services',
    timestamps: false,
  })

  return RoomService
}
