const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['profile', 'work', 'message'],
    default: 'work'
  }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
