import { useEffect, useRef, useState } from "react";

import Message from "./Message";

import { useChatMessages } from "../hooks/useChatMessages";
import { useChat } from "../hooks/useChat";
import { useReceiveMessage } from "../hooks/useSocketReceiveMessage";

function Messages() {
  const { chat } = useChat();
  const { messages } = useChatMessages();
  const [localMessages, setLocalMessages] = useState(messages || []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useReceiveMessage(setLocalMessages);

  useEffect(() => {
    if (messages) setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  return (
    <div className="flex flex-col gap-4 bg-[var(--color-grey-50)] text-gray-900 p-4">
      {chat?.type === "PUBLIC" && (
        <div className="flex items-center justify-center ">
          <span className="bg-[var(--color-grey-200)] opacity-50 px-4 py-2 rounded-3xl text-[var(--color-grey-900)] text-sm font-semibold">
            {localMessages.length > 0
              ? "Messages from the last 24 hours"
              : "No messages in the last 24 hours"}
          </span>
        </div>
      )}

      {localMessages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default Messages;
