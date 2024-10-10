const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dtqfi6ksg', 
  api_key: '935983652935343', 
  api_secret: 'k7ikPwfs9cj5_pTbFuRM8M1DNE0',
  secure: true
});

module.exports = cloudinary