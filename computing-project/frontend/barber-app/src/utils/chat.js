const getLikedBarbers = async (userId) => {
  let authorization = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/barbers/liked-list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch liked barbers");
    }

    const resp = await response.json();

    return resp;
  } catch (error) {
    console.error("Error fetching barber work:", error);
  }
};
///
const handleBarberSelect = async (barberId, navigateToConversation) => {
  const authorization = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/message/conversations/findOrCreateConversation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
        body: JSON.stringify({ barberId }),
      }
    );

    const conversation = await response.json();

    return conversation;
  } catch (error) {
    console.error("Error selecting barber:", error);
  }
};

const fetchConversationDetails = async (conversationId) => {
  const authorization = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/message/conversations/conversation-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
        body: JSON.stringify({ conversationId }),
      }
    );

    const conversation = await response.json();
    return conversation;
  } catch (error) {
    console.error("Error selecting barber:", error);
  }
};

const getConversationMessages = async (conversationId) => {
  const authorization = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/message/conversations/get-messages?conversationId=${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    const conversation = await response.json();
    return conversation;
  } catch (error) {
    console.error("Error selecting barber:", error);
  }
};

const sendMessage = async (conversationId, text) => {
  const authorization = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/message/conversations/send-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
        body: JSON.stringify({ conversationId, text }),
      }
    );

    const conversation = await response.json();

    return conversation;
  } catch (error) {
    console.error("Error selecting barber:", error);
  }
};

const getConversations = async (userId) => {
  let authorization = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/message/conversations/list`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authorization}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const conversations = await response.json();
    return conversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

export {
  getLikedBarbers,
  handleBarberSelect,
  fetchConversationDetails,
  getConversationMessages,
  sendMessage,
  getConversations
};
