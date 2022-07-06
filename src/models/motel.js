'use strict'

const { Model } = require('sequelize')
const Serializer = require('../helpers/serializer').default

module.exports = (sequelize, DataTypes) => {
  class Motel extends Model {
    static #scheme = {
      include: ['@all', 'landlord'],
      exclude: ['@fk'],
      assoc: {
        landlord: {
          include: ['fullname', 'phonenumber']
        }
      }
    }

    static associate(models) {
      this.belongsTo(models['User'], { as: 'landlord', foreignKey: 'userId' })
      this.hasMany(models['Room'], { foreignKey: 'motelId' })
    }

    static serializeMany(instances, options) {
      return Serializer.serializeMany(instances, this, Motel.#scheme, options)
    }

    static serialize(instance, options) {
      return (new Serializer(this, Motel.#scheme, options)).serialize(instance)
    }
  }

  Motel.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'Motel',
    tableName: 'motels',
  })

  return Motel
}
