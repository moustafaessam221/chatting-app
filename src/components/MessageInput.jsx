import React from 'react';

const MessageInput = ({ handleSubmit, newMessage, setNewMessage }) => (
  <form className="new-message-form flex p-4 bg-gray-200" onSubmit={handleSubmit}>
    <input
      className="new-message-input flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Type your message here..."
      onChange={(e) => setNewMessage(e.target.value)}
      value={newMessage}
      aria-label="Message input"
    />
    <button
      type="submit"
      className="send-button bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition duration-200"
      aria-label="Send message"
    >
      Send
    </button>
  </form>
);

export default MessageInput;
