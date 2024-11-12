import { useState, useRef } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
import { Chat } from "./components/Chat";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);

  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  if (!isAuth) return <Auth setIsAuth={setIsAuth} />;

  return (
    <>
      {room ? (
        <Chat room={room} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">
            Enter Room Name
          </h1>
          <input
            type="text"
            id="room"
            ref={roomInputRef}
            className="w-full max-w-xs p-2 mb-4 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => setRoom(roomInputRef.current.value)}
            className="w-full max-w-xs p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            Enter Chat
          </button>
        </div>
      )}
      <div className="absolute top-4 right-4">
        <button
          onClick={signUserOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          Sign Out
        </button>
      </div>
    </>
  );
}

export default App;
