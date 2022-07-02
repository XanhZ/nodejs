/**
 * Serialize an instance according to the provided options.
 *
 * @param {object} instance Sequelize instance to be serialized
 * @param {object} options Options indicating how to serialize the instance.
 * @param {[string]} options.attributes A whitelist of attributes to serialize.
 * @return {object} The serialized object
 */
export default async function (instance, options = {}) {
  if (!instance) return null
  const result = {};
  // Serialize all attributes
  const attributes = options.attributes || []
  for (const attribute of attributes) {
    result[attribute] = instance[attribute] === null ? '' : await instance[attribute]
  }
  return result;
}