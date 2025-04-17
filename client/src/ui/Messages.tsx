import { useEffect, useRef, useState } from "react";
import { useChatMessages } from "../hooks/useChatMessages";
import Message from "./Message";
import { socket } from "../services/socket";
import { Message as MessageType } from "../types/types";

function Messages() {
  const { messages } = useChatMessages();
  const [localMessages, setLocalMessages] = useState(messages || []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages) setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: MessageType) => {
      // Handle the received message
      setLocalMessages((prev) => [...prev, data]);
    };

    // Listen for incoming messages
    socket.on("receive_message", handleReceiveMessage);

    // Cleanup function to remove the listeners
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  return (
    <div className="flex flex-col gap-4 bg-[var(--color-grey-50)] text-gray-900 p-4">
      {localMessages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default Messages;
