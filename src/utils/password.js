import { hashSync, compareSync } from 'bcryptjs'

class Password {
  /**
   * Generates hash string of password
   * 
   * @param {string} password 
   * @returns {string} Resulting hash
   */
  static hash(password) {
    return hashSync(password)
  }

  /**
   * Check if password is correct
   * 
   * @param {string} password password need to checked
   * @param {string} hash value password must be matched after being hashed
   * @returns {boolean} true if match
   */
  static check(password, hash) {
    return compareSync(password, hash)
  }
}

export default Password
