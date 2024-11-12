import { useEffect, useState, useCallback } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "../styles/Chat.css";
import { format } from "date-fns";

export const Chat = ({ room }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [room]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (newMessage.trim() === "") return;

      try {
        await addDoc(messagesRef, {
          text: newMessage,
          createdAt: serverTimestamp(),
          user: auth.currentUser.displayName || "Anonymous",
          email: auth.currentUser.email,
          room,
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    },
    [newMessage, room, messagesRef]
  );

  const currentUserEmail = auth.currentUser?.email;

  return (
    <div className="chat-app bg-gray-100 min-h-screen flex flex-col">
      <div className="header bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-semibold">
          Welcome to: {room.toUpperCase()}
        </h1>
      </div>

      {loading ? (
        <div className="loading-indicator text-center text-gray-500">
          Loading messages...
        </div>
      ) : (
        <div className="messages flex-1 overflow-y-auto p-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.email === currentUserEmail;
              const createdAt = message.createdAt
                ? message.createdAt.toDate
                  ? message.createdAt.toDate()
                  : new Date(message.createdAt)
                : new Date();
              const formattedDate = format(createdAt, "MMM d, yyyy h:mm a");

              return (
                <div
                  key={message.id}
                  className={`message mb-4 p-3 shadow rounded ${
                    isCurrentUser
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black mr-auto"
                  } ${isCurrentUser ? "self-end" : "self-start"}`}
                  style={{
                    maxWidth: "75%",
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`user font-bold ${
                        isCurrentUser ? "text-white" : "text-blue-600"
                      }`}
                    >
                      {message.user}
                    </span>
                    <span className="text-sm text-gray-500">
                      {message.createdAt ? formattedDate : "Sending..."}
                    </span>
                    <p className="ms-2 text-lg">{message.text}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>
      )}

      <form
        className="new-message-form flex p-4 bg-gray-200"
        onSubmit={handleSubmit}
      >
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
    </div>
  );
};
