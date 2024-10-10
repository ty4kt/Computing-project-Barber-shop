const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Conversation'
  },
  type: {
    type: String,
    required: true,
    enum: ['user', 'system'], 
    default: 'user'
  },
  action: {
    type: String, // e.g., 'appointment-invitation', 'appointment-confirmation'
    required: false // This field can be optional, only filled for system messages
  },
  actionDetails: {
    type: mongoose.Schema.Types.Mixed, // Can store various types of data
    required: false // Only used for system messages with additional details
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
