import { FaPlus } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import Messages from "./Messages";
import { useChat } from "../hooks/useChat";
import { useEffect, useRef, useState } from "react";

function Chat() {
  //  1) use chat data for current chatId
  const { chat } = useChat();
  //  2) pass messages to Messages component

  //  3) handle sockets for send_message and receive_message

  //  4) handle send message
  //  5) handle receive message
  //  6) handle typing indicator
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea on input
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
    }
  }, [message]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-2 border-[var(--color-grey-100)] flex items-center gap-4">
        <h2 className="text-4xl font-semibold ">{chat?.name}</h2>
      </div>
      <div className="overflow-y-auto grow">
        <Messages />
      </div>
      <div className="flex gap-4 items-center border-t-2 border-[var(--color-grey-100)] px-6 lg:px-12 py-6">
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
        <button className="text-xl">
          <IoMdSend />
        </button>
      </div>
    </div>
  );
}

export default Chat;
