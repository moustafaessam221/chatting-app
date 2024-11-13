import React, { useEffect, useRef } from "react";
import Message from "./Message";

const MessageList = ({
  messages,
  currentUserEmail,
  deleteMessage,
  loading,
}) => {
  const messageEndRef = useRef(null); // To scroll to the bottom of the message list

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This effect will run when the messages state changes

  const messageList =
    messages.length > 0 ? (
      messages.map((message) => (
        <Message
          key={message.id}
          photoUrl={message.photoUrl}
          message={message}
          isCurrentUser={message.email === currentUserEmail}
          deleteMessage={deleteMessage}
        />
      ))
    ) : (
      <p className="text-gray-500">No messages yet. Start the conversation!</p>
    );

  return (
    <div className="messages flex-1 overflow-y-auto p-4">
      {loading ? (
        <div className="loading-indicator text-center text-gray-500">
          Loading messages...
        </div>
      ) : (
        messageList
      )}

      {/* Empty div to ensure the scrolling happens to the bottom */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
