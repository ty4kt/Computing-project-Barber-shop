import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWindow";
import BarberSchedule from "../components/Chat/BarberSchedule";
import BottomBar from "../components/BottomBar";
import Calendar from "../components/Chat/Calendar";
import { useUser } from "../contexts/UserContext";
import {
  getLikedBarbers,
  handleBarberSelect as handleBarberSelectUtil,
  fetchConversationDetails,
  getConversationMessages,
  getConversations,
} from "../utils/chat";

const Chat = () => {
  const { user } = useUser();
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  // Calendar related states
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    // Moved inside useEffect to ensure 'user' is defined
    const loadConversations = async () => {
      const userConversations = await getConversations(user._id);
      setChats(userConversations || []);
    };

    if (user) {
      loadConversations();
    }

    const fetchBarbers = async () => {
      const response = await getLikedBarbers();
      if (response && response.ok && Array.isArray(response.likedBarbers)) {
        setBarbers(response.likedBarbers);
      }
    };

    if (user && user.accountType === "client") {
      fetchBarbers();
    }
  }, [user]);

  useEffect(() => {
    const fetchNewMessages = async () => {
      if (selectedConversation && selectedConversation.id) {
        const fetchedMessages = await getConversationMessages(selectedConversation.id);
        setMessages(fetchedMessages || []);
      }
    };

    const intervalId = setInterval(() => {
      fetchNewMessages();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [selectedConversation]);

  const handleBarberSelect = async (barberId) => {
    const selectedBarber = barbers.find((barber) => barber._id === barberId);
    setSelectedBarber(selectedBarber);

    const conversationId = await handleBarberSelectUtil(barberId);
    openConversation(conversationId);
  };

  const openConversation = async (conversationId) => {
    conversationId = conversationId._id;
    setSelectedConversation({ id: conversationId });

    const conversationDetails = await fetchConversationDetails(conversationId);
    console.log("Fetched conversation details:", conversationDetails);

    setSelectedParticipant(conversationDetails);

    const fetchedMessages = await getConversationMessages(conversationId);
    setMessages(fetchedMessages || []);
  };

  const closeConversation = () => {
    setSelectedConversation(null);
    setSelectedBarber(null); // Clear selected barber when closing the conversation
  };

  return (
    <>
      <Layout>
        <div
          className={`chat-container bg-[#121212] h-full p-10 ${
            selectedConversation ? "relative z-[400]" : ""
          }`}
        >
          {selectedConversation && selectedParticipant ? (
            <ChatWindow
              messages={messages || []}
              conversationId={selectedConversation.id}
              participant={selectedParticipant}
              onClose={closeConversation}
              user={user}
            />
          ) : (
            <>
              {/* <Calendar
                month={currentMonth}
                year={currentYear}
                appointments={[]}
              /> */}

              {user.accountType === "client" && (
                <BarberSchedule
                  barbers={barbers}
                  onBarberSelect={handleBarberSelect}
                />
              )}

              <ChatList chats={chats} onBarberSelect={handleBarberSelect} />
            </>
          )}
        </div>
        <BottomBar />
      </Layout>
    </>
  );
};

export default Chat;
