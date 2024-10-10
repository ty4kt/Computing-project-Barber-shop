import React, { useState, useEffect, useRef } from "react";
import { sendMessage } from "../../utils/chat";
import { createAppointment, getAppointmentById } from "../../utils/appointment";
import AppointmentModal from "./AppointmentModal";
import Profile from "../Main/Profile";

const ChatWindow = ({
  conversationId,
  participant,
  messages,
  onClose,
  user,
}) => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState(messages || []);
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] =
    useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setAllMessages(messages || []);
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [allMessages]);

  const isNewDay = (message, index) => {
    if (index === 0) return true;
    const prevMessage = allMessages[index - 1];
    return (
      new Date(message.createdAt).toDateString() !==
      new Date(prevMessage.createdAt).toDateString()
    );
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }
    try {
      const sentMessage = await sendMessage(conversationId, newMessage);
      setAllMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error occurred while sending message:", error);
    }
  };

  const handleShowProfile = () => {
    setIsProfileVisible(true);
  };

  const handleCloseProfile = () => {
    setIsProfileVisible(false);
  };

  const handleToggleAppointmentModal = () => {
    setIsAppointmentModalVisible(!isAppointmentModalVisible);
  };

  const handleCreateAppointment = async (appointmentDetails) => {
    try {
      const newAppointment = await createAppointment(
        participant._id,
        appointmentDetails.date,
        appointmentDetails.services,
        appointmentDetails.notes
      );

      handleToggleAppointmentModal();
    } catch (error) {
      console.error("Error occurred while creating appointment:", error);
    }
  };

  // Inside your ChatWindow component

  const handleSystemMessageClick = async (message) => {
    if (
      message.type === "system" &&
      message.action === "appointment-invitation"
    ) {
      const appointmentId = message.actionDetails.appointmentId;
      try {
        const appointmentDetails = await getAppointmentById(appointmentId);
        setAppointmentDetailsForModal(appointmentDetails);
        setIsAppointmentModalVisible(true);
      } catch (error) {
        console.error(
          "Error occurred while fetching appointment details:",
          error
        );
        // Handle error, such as displaying a notification to the user
      }
    }
  };

  const [appointmentDetailsForModal, setAppointmentDetailsForModal] =
    useState(null);

  const handleAcceptAppointment = (appointmentId) => {
    console.log("Accepting appointment with ID:", appointmentId);
  };

  const handleDeclineAppointment = (appointmentId) => {
    console.log("Declining appointment with ID:", appointmentId);
  };

  function getBgClass(action) {
    switch (action) {
      case "appointment-acceptance":
        return "bg-green-500"; // Green for acceptance
      case "appointment-completed":
        return "bg-blue-500"; // Blue for completed
      case "appointment-cancelled":
        return "bg-red-500"; // Red for cancelled
      default:
        return ""; // No background for other cases
    }
  }

  return (
    <div className="chat-window">
      {isProfileVisible && (
        <Profile
          participant={participant}
          onClose={handleCloseProfile}
          showActions={false}
        />
      )}

      {/* Chat header and participant profile picture */}
      {/* ... */}
      <div className="chat-header text-white flex justify-between items-center text-center">
        <button onClick={onClose}>Close</button>
        <div>
          <h1
            className="text-2xl font-bold"
            onClick={() => handleShowProfile()}
          >
            {participant?.name || "No participant Selected"}
          </h1>
          <p className="text-center text-[#818181]">Chat</p>
        </div>
        <div>
          <img
            className="w-12 h-12 rounded-full"
            src={participant?.profilePicture || "n/a"}
          />
        </div>
      </div>
      <div
        className="messages-container space-y-2 p-4 overflow-y-auto max-h-[70vh]"
        ref={messagesEndRef}
      >
        {allMessages.map((message, index) => (
          <React.Fragment key={index}>
            {isNewDay(message, index) && (
              <div className="text-center my-2">
                <span className="text-xs text-white bg-gray-600 px-2 py-1 rounded-full">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {message.type === "system" ? (
              // Rendering system messages differently
              <div className="text-center my-2">
                <button
                  onClick={() => handleSystemMessageClick(message)}
                  className={`text-white py-2 px-4 rounded-md ${getBgClass(
                    message.action
                  )}`}
                >
                  {message.text} {/* Display the text of system message */}
                </button>
              </div>
            ) : (
              <div
                className={`flex ${
                  message.sender === user._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === user._id
                      ? "bg-[#497CFF] text-white" // Styling for messages from the current user
                      : "bg-[#242424] text-white" // Styling for messages from the other participant
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                <p className="text-xs text-white opacity-75 mt-1 self-end">
                  {new Date(message.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Message input */}
      <form
        className="fixed max-w-xl bottom-0 left-0 right-0 flex justify-center items-center p-4 z-50 mx-auto space-x-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          className="text-white bg-[#0B0B0B] p-4 w-full rounded-lg text-left focus:outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        {user && user.accountType === "client" && (
          <button
            type="button" // This specifies the button as a non-submit button
            className="bg-[#0B0B0B] p-4 w-16 rounded-lg"
            onClick={handleToggleAppointmentModal}
          >
            <i className="fa-solid fa-calendar text-white"></i>
          </button>
        )}
        <button type="submit" className="bg-[#0B0B0B] p-4 rounded-lg">
          <i className="fa-solid fa-paper-plane text-white"></i>
        </button>
      </form>

      {isAppointmentModalVisible && (
        <AppointmentModal
          appointment={appointmentDetailsForModal}
          onSubmit={handleCreateAppointment}
          onClose={() => {
            setAppointmentDetailsForModal(null);
            handleToggleAppointmentModal();
          }}
          isEditable={user.accountType === "client"}
          onAccept={handleAcceptAppointment} // You need to define this function
          onDecline={handleDeclineAppointment} // You need to define this function
        />
      )}
    </div>
  );
};

export default ChatWindow;
