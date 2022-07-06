'use strict'

const { Model } = require('sequelize')
const Serializer = require('../helpers/serializer').default

module.exports = (sequelize, DataTypes) => {
  class RoomImage extends Model {
    static #scheme = {
      include: ['url', 'publicId'],
      exclude: ['@fk']
    }

    static associate(models) {
      this.belongsTo(models['Room'], { foreignKey: 'roomId' })
    }

    static serializeMany(instances, options) {
      return Serializer.serializeMany(instances, this, RoomImage.#scheme, options)
    }

    static serialize(instance, options) {
      return (new Serializer(this, RoomImage.#scheme, options)).serialize(instance)
    }
  }

  RoomImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
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
    publicId: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'RoomImage',
    tableName: 'room_images',
    timestamps: false,
  })

  return RoomImage
}
