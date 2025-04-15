import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [inputRoom, setInputRoom] = useState("");

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    socket.emit("send_message", {
      content: inputMessage,
      chatId: room,
      senderId: "1dc8fd28-595c-4350-ab9b-405ba6fd9f63",
      type: "TEXT",
    });
    // setMessages((prevMessages) => [...prevMessages, inputMessage]);
    setInputMessage("");
  }

  function joinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!inputRoom) return;
    socket.emit("join_room", { chatId: inputRoom });
    setRoom(inputRoom);
    setInputRoom("");
  }

  useEffect(() => {
    function handleReceiveMessage(data) {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data.content]);
    }

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2">
      <h1>Welcome to chat app</h1>
      <p>This content is beautifully styled.</p>

      <h2>{room ? `Room: ${room}` : "Not joined to any room"}</h2>
      {room && (
        <button
          className="bg-red-500 px-3 py-2 rounded-3xl text-amber-50"
          onClick={() => setRoom("")}
        >
          Leave room
        </button>
      )}
      <form className="flex gap-1 items-center" onSubmit={joinRoom}>
        <input
          className="form-input w-full"
          placeholder="Room ID"
          value={inputRoom}
          onChange={(e) => setInputRoom(e.target.value)}
        />
        <button
          className="bg-blue-400 px-3 py-1 rounded-2xl text-white"
          type="submit"
        >
          Join
        </button>
      </form>
      <form className="flex gap-1 items-center" onSubmit={sendMessage}>
        <input
          className="form-input w-full"
          placeholder="message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          className="bg-blue-400 px-3 py-1 rounded-2xl text-white"
          type="submit"
        >
          Send
        </button>
      </form>
      {room && (
        <div className="flex flex-col gap-2 items-center ">
          <h1>Messages</h1>
          <div className="bg-amber-200 w-[200px] h-[200px]">
            {messages.map((message, index) => (
              <div key={index} className=" p-2 rounded-md">
                {message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
