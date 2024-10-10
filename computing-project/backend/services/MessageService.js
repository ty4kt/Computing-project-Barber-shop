const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

class MessageService {
  static async findOrCreateConversation(userId, barberId) {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, barberId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [userId, barberId],
        });
        await conversation.save();
      }

      return conversation;
    } catch (error) {
      console.error("Error in finding or creating a conversation:", error);
      throw error;
    }
  }

  static async createMessage(conversationId, sender, text) {
    const message = new Message({ conversationId, sender, text });
    await message.save();
    return message;
  }

  static async getMessagesForConversation(conversationId) {
    const messages = await Message.find({ conversationId }).sort("createdAt");
    return messages;
  }

  static async getRecentMessages(conversationId, limit = 10) {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return messages;
  }

  static async getConversationDetails(conversationId, userId) {
    try {
  
      const conversation = await Conversation.findById(conversationId)
        .populate({
          path: "participants",
          select: "full_name profile.profile_picture accountType _id",
        })
        .exec();
  
  
      if (!conversation) {
        throw new Error("Conversation not found");
      }
  
      const otherParticipant = conversation.participants.find(
        participant => participant._id.toString() !== userId
      );
  
      if (!otherParticipant) {
        throw new Error("Other participant not found");
      }
  
      return {
        _id: otherParticipant._id,
        name: otherParticipant.full_name,
        profilePicture: otherParticipant.profile.profile_picture, 
        accountType: otherParticipant.accountType
      };
    } catch (error) {
      console.error("Error in getConversationDetails:", error);
      throw error;
    }
  }
  
  static async createAppointmentAttemptMessage(data) {
    const message = new Message(data);
    await message.save();
    return message;
  }

  static async createSystemMessage(conversationId, senderId, action, actionDetails, text) {
    try {
      const newMessage = new Message({
        conversationId,
        type: 'system',
        action,
        actionDetails,
        sender: senderId,
        text,
      });
  
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.error('Error creating system message:', error);
      throw error; 
    }
  }
}

module.exports = MessageService;
