import { useEffect, useState } from "react";
import { useChatMessages } from "../hooks/useChatMessages";
import Message from "./Message";
import { socket } from "../services/socket";

function Messages() {
  const { messages } = useChatMessages();
  const [localMessages, setLocalMessages] = useState(messages || []);

  useEffect(() => {
    if (messages) setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // Handle the received message
      console.log("Received message:", data);
      setLocalMessages((prev) => [...prev, data]);
    };

    // Listen for incoming messages
    socket.on("receive_message", handleReceiveMessage);

    // Cleanup function to remove the listeners
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-[var(--color-grey-50)] text-gray-900 p-4">
      {localMessages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}

export default Messages;
