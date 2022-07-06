import ImageKit from 'imagekit'
import { UploadedFile } from 'express-fileupload'

class Image {
  static #imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  })

  /**
   * Upload single image
   * 
   * @param {UploadedFile} image Image needs to be stored
   */
  static upload(image) {
    return this.#imagekit.upload({
      file: image.data,
      fileName: image.name
    })
  }

  /**
   * Upload multiple images
   * 
   * @param {UploadedFile[]} images Images need to be stored
   */
  static async uploadMulti(images) {
    try {
      return await Promise.all(images.map(image => this.upload(image)))
    } catch (error) {
      throw Error('Upload images fail !!!')
    }
  }

  /**
   * Delete multiple images
   * 
   * @param  {...any} imageIds Id of images need to be deleted
   */
  static delete(...imageIds) {
    return this.#imagekit.bulkDeleteFiles(imageIds)
  }
}

export default Image
