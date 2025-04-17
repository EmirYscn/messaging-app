import { FaPlus } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import Messages from "./Messages";
import { useChat } from "../hooks/useChat";
import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";
import { useUser } from "../hooks/useUser";

function Chat() {
  //  1) use chat data for current chatId
  const { user } = useUser();
  const { chat } = useChat();

  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Join the room when the component mounts
  useEffect(() => {
    socket.emit("join_room", { chatId: chat?.id });

    return () => {
      socket.emit("leave_room", { chatId: chat?.id });
    };
  }, [chat?.id]);

  // Auto-grow textarea on input
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
    }
  }, [message]);

  function handleMessageSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() === "") return; // Prevent sending empty messages
    const data = {
      content: message,
      chatId: chat?.id,
      senderId: user?.id,
      type: "TEXT",
    };
    console.log("Sent message:", data);
    socket.emit("send_message", data);
    setMessage("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-2 border-[var(--color-grey-100)] flex items-center gap-4">
        <h2 className="text-4xl font-semibold ">{chat?.name}</h2>
      </div>
      <div className="overflow-y-auto grow">
        <Messages />
      </div>
      <form
        onSubmit={handleMessageSubmit}
        className="flex gap-4 items-center border-t-2 border-[var(--color-grey-100)] px-6 lg:px-12 py-6"
      >
        <button className="text-xl">
          <FaPlus />
        </button>
        <textarea
          placeholder="Type a message..."
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          className="w-full resize-none h-max focus:outline-none bg-[var(--color-grey-100)] px-6 py-2 shadow-sm rounded-lg max-h-[200px] overflow-y-auto"
        />
        <button
          type="submit"
          className="text-xl disabled:opacity-50"
          disabled={!message}
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}

export default Chat;
