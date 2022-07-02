import instance from './instance'
/**
 * Return a function for Sequelize instances to serialize themselves.
 *
 * @param {object|Function} options Object of options
 * @param {Array[String]} options.attributes Whitelisted array of attributes
 * @param {Array[String]} options.associations Whitelisted array of associations
 *
 * @return {Function} (options) serializer function
 */
export default function (options = {}) {
  async function serialize(options) {
    return instance(this, options)
  }
}