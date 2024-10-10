import React from 'react';

const ChatItem = ({ chat, onSelect }) => {

  console.log(`chat:`, chat)

  return (
    <div className="chat-item flex items-center justify-between p-4 hover:bg-[#0B0B0B] rounded-md cursor-pointer" onClick={onSelect}>
      <img src={chat.profilePicture} alt={`${chat.name}'s avatar`} className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-grow ml-4">
        <h5 className="chat-name text-white font-semibold text-lg">{chat.name}</h5>
        <p className="chat-preview text-[#393939] text-md truncate mt-1 font-medium">{chat.lastMessage}</p>
      </div>
      <span className="chat-timestamp text-[#393939] text-md">{chat.timestamp}</span>
    </div>
  );
};

export default ChatItem;
