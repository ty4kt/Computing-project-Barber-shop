import React from "react";
import ChatItem from "./ChatItem";

const ChatList = ({ chats, onBarberSelect }) => {
  if (!Array.isArray(chats)) {
    console.error("Invalid chats prop, expected an array.");
    return null; // or return a placeholder element
  }

  return (
    <div className="chat-list">
      <h1 className="text-white text-2xl font-bold">Chats</h1>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onSelect={() => onBarberSelect(chat.id)}
          />
        ))
      ) : (
        <div className="text-white text-center">
          <p>No chats found. 😔</p>
          <p>Try starting a conversation with one you like!</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
