import { useRef, useState } from "react";
import { socket } from "../services/socket";
import { useUser } from "../hooks/useUser";
import { FaPlus } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { Chat } from "../types/types";

type MessageInputProps = {
  chat: Chat;
};

function MessageInput({ chat }: MessageInputProps) {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleMessageSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() === "") return; // Prevent sending empty messages
    const data = {
      content: message,
      chatId: chat?.id,
      senderId: user?.id,
      type: "TEXT",
    };
    socket.emit("send_message", data);
    setMessage("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit(e);
    }
  }

  return (
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
        onKeyDown={handleKeyDown}
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
  );
}

export default MessageInput;
