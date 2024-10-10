const cloudinary = require("../config/cloudinary");
const Media = require("../models/Media");

class MediaService {
  static async uploadImage(file) {
    try {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  }

  static async uploadWorkImage(userId, file) {
    try {
      const result = await cloudinary.uploader.upload(file.path);

      const newMedia = await Media.create({
        user: userId,
        imageUrl: result.secure_url,
        type: "work",
      });

      return newMedia;
    } catch (error) {
      console.error("Error uploading work image:", error);
      throw error;
    }
  }
}

module.exports = MediaService;
