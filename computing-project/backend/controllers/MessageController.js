const MessageService = require("../services/MessageService");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const UtilityHelper = require("../helpers/UtilityHelper");

class MessageController {
  async findOrCreateConversation(req, res) {
    const userId = req.user.id;
    const { barberId } = req.body;

    if (!barberId) {
      return res.status(400).json({
        ok: false,
        message: "missing barberid",
      });
    }

    try {
      const conversation = await MessageService.findOrCreateConversation(
        userId,
        barberId
      );

      res.status(200).json(conversation);
    } catch (error) {
      console.error(
        "Error handling conversation lookup/creation in controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async conversationDetails(req, res) {
    const userId = req.user.id;
    const { conversationId } = req.body;

    try {
      const details = await MessageService.getConversationDetails(
        conversationId,
        userId
      );

      res.status(200).json(details);
    } catch (error) {
      console.error(
        "Error handling conversation details in controller:",
        error.message
      );
      const statusCode =
        error.message === "Conversation not found" ||
        error.message === "Other participant not found"
          ? 404
          : 500;
      res.status(statusCode).json({ message: error.message });
    }
  }
  async sendMessage(req, res) {
    try {
      const { conversationId, text } = req.body;
      const senderId = req.user.id;

      const convId =
        typeof conversationId === "object" ? conversationId.id : conversationId;

      const message = await MessageService.createMessage(
        convId,
        senderId,
        text
      );
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const { conversationId } = req.query;

      const messages = await MessageService.getMessagesForConversation(
        conversationId
      );

      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getLastConversations(req, res) {
    const userId = req.user.id;

    try {
      const conversations = await Conversation.find({
        participants: { $in: [userId] },
      })
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

      let lastMessagesPromises = conversations.map(async (conversation) => {

        if (
          !conversation.participants ||
          conversation.participants.some((participant) => !participant)
        ) {
          console.error("Invalid participants in conversation:", conversation);
          return null;
        }

        // Find the index of the current user and get the index of the other participant
        const otherParticipantIndex = conversation.participants.findIndex(
          (participant) => participant.toString() !== userId
        );
        const otherParticipantId =
          conversation.participants[otherParticipantIndex];

        // Fetch the other participant's details
        const otherParticipant = await User.findById(otherParticipantId).lean();

        if (!otherParticipant) {
          console.error("Other participant not found:", otherParticipantId);
          return null;
        }

        const lastMessage = await Message.findOne({
          conversationId: conversation._id,
        })
          .sort({ createdAt: -1 })
          .lean();

        // Prepare the response object
        let conversationResponse = {
          conversationId: conversation._id,
          id: otherParticipant._id,
          name: otherParticipant.full_name,
          profilePicture: otherParticipant.profile.profile_picture,
          lastMessage: lastMessage ? lastMessage.text : "",
          timestamp: lastMessage
            ? UtilityHelper.timeSince(new Date(lastMessage.createdAt))
            : "",
        };

        return conversationResponse;
      });

      const lastMessages = (await Promise.all(lastMessagesPromises)).filter(
        Boolean
      ); // Remove null entries

      res.json(lastMessages);
    } catch (error) {
      console.error("Error getting last conversations:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MessageController();
