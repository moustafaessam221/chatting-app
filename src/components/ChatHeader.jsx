import React from 'react';

const ChatHeader = ({ room }) => (
  <div className="header bg-blue-600 text-white py-4 px-6">
    <h1 className="text-2xl font-semibold">
      Welcome to: {room.toUpperCase()}
    </h1>
  </div>
);

export default ChatHeader;
