import slug from 'limax'

class Slug {
  /**
   * Convert text to slug URL
   * 
   * @param {string} text 
   * @returns Slugified text
   */
  static slugify(text) {
    return slug(text, { lang: 'vn', separator: '-' })
  }
}

export default Slug
