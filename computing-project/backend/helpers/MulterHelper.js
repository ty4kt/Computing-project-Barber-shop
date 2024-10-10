const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'barber_images',
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
