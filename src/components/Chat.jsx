import React, { useEffect, useState, useCallback } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export const Chat = ({ room, leaveRoom }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const messagesRef = collection(db, "messages");

  // Fetch messages from Firebase
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

    return () => unsubscribe();
  }, [room]);

  // Send a new message to Firebase
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
          photoUrl: auth.currentUser.photoURL,
          room,
        });
        setNewMessage(""); // Clear the input after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [newMessage, room, messagesRef]
  );

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const currentUserEmail = auth.currentUser?.email;

  return (
    <div className="chat-app bg-gray-100 h-screen flex flex-col mx-[8%]">
      <ChatHeader room={room} />
      
      {/* Pass messages and other props to MessageList */}
      <MessageList
        messages={messages}
        currentUserEmail={currentUserEmail}
        deleteMessage={deleteMessage}
        loading={loading}
      />

      {/* Message Input */}
      <MessageInput
        handleSubmit={handleSubmit}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />

      {/* Leave Room Button */}
      <button
        onClick={leaveRoom}
        className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
      >
        Leave Room
      </button>
    </div>
  );
};
