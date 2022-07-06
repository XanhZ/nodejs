'use strict'

const { Model } = require('sequelize')
const Serializer = require('../helpers/serializer').default

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static #scheme = {
      include: ['@all', 'motel', 'images', 'services'],
      exclude: ['@fk'],
      assoc: {
        motel: {
          include: ['province', 'district', 'ward', 'street', 'landlord'],
          assoc: {
            landlord: {
              include: ['fullname', 'phonenumber']
            }
          }
        },
        images: {
          include: ['url', 'publicId']
        },
        services: {
          include: ['service', 'quantiy', 'unity', 'price'],
          assoc: {
            service: {
              include: ['id', 'name'],
            }
          }
        }
      }
    }

    static associate(models) {
      this.belongsTo(models['Motel'], { as: 'motel', foreignKey: 'motelId' })
      this.hasMany(models['RoomImage'], { as: 'images', foreignKey: 'roomId' })
      this.hasMany(models['RoomService'], { as: 'services', foreignKey: 'roomId' })
    }

    static serializeMany(instances, options) {
      return Serializer.serializeMany(instances, this, Room.#scheme, options)
    }

    static serialize(instance, options) {
      return (new Serializer(this, Room.#scheme, options)).serialize(instance)
    }
  }

  Room.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deposit: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
    },
    motelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'motels',
        key: 'id'
      },
      onDelete: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms'
  })

  return Room
}