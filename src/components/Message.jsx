import React from "react";
import { format } from "date-fns";

const Message = ({ message, isCurrentUser, deleteMessage }) => {
  const createdAt = message.createdAt
    ? message.createdAt.toDate
      ? message.createdAt.toDate()
      : new Date(message.createdAt)
    : new Date();
  const formattedDate = format(createdAt, "hh:mm a");

  return (
    <div
      className={`message mb-4 p-3 shadow-md rounded-lg ${
        isCurrentUser
          ? "bg-[#DCF8C6] text-black ml-auto"
          : "bg-white text-black mr-auto"
      }`}
      style={{
        maxWidth: "55%",
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
        borderRadius: "18px 18px 4px 18px",
      }}
    >
      <div className="flex items-start mb-1">
        {message.photoUrl ? (
          <img
            src={message.photoUrl}
            alt={`${message.user}'s profile`}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 mr-2">
            {message.user?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`font-semibold ${
                isCurrentUser ? "text-green-800" : "text-blue-600"
              }`}
            >
              {message.user}
            </span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className="text-md leading-6 break-words text-gray-800">
            {message.text}
          </p>
        </div>
      </div>
      {isCurrentUser && (
        <button
          onClick={() => deleteMessage(message.id)}
          className="text-red-400 hover:text-red-600 text-xs mt-2 ml-auto"
          aria-label="Delete message"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default Message;
