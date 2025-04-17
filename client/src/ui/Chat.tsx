import { FaPlus } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { RiRadioButtonLine } from "react-icons/ri";
import Messages from "./Messages";
import { useChat } from "../hooks/useChat";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../hooks/useUser";
import { User } from "../types/types";
import { socket } from "../services/socket";

function Chat() {
  const { user } = useUser();
  const { chat } = useChat();

  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<User[] | null>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Join the room when the component mounts
  useEffect(() => {
    if (!socket) return;

    socket.emit("join_room", { chatId: chat?.id });

    return () => {
      socket.emit("leave_room", { chatId: chat?.id });
    };
  }, [chat?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleAddToActiveUsers = (data: User) => {
      const userExists = activeUsers?.some((user) => user.id === data.id);
      if (!userExists) {
        setActiveUsers((prev) => [...(prev || []), data]);
      }
    };

    const handleRemoveFromActiveUsers = (data: User) => {
      const updatedActiveUsers = activeUsers?.filter(
        (user) => user.id !== data?.id
      );
      setActiveUsers(updatedActiveUsers!);
    };

    // Listen for incoming messages
    socket.on("add_to_active_users", handleAddToActiveUsers);
    socket.on("remove_from_active_users", handleRemoveFromActiveUsers);

    // Cleanup function to remove the listeners
    return () => {
      socket.off("add_to_active_users", handleAddToActiveUsers);
      socket.off("remove_from_active_users", handleRemoveFromActiveUsers);
    };
  }, [activeUsers]);

  function handleMessageSubmit(e: React.FormEvent) {
    if (!socket) return;

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
    <div className="flex h-full">
      {/* Left: Chat area */}
      <div className="flex flex-col w-full h-full">
        <div className="p-4 border-b-2 border-[var(--color-grey-100)] flex items-center gap-4">
          <h2 className="text-4xl font-semibold ">{chat?.name}</h2>
        </div>

        {/* Make the Messages container scrollable */}
        <div className="flex-grow overflow-y-auto">
          <Messages />
        </div>

        {/* Message input */}
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
      </div>

      {/* Right: Active Users Panel */}
      {chat?.type === "PUBLIC" && (
        <div className="hidden lg:block w-1/4 border-l-1 border-[var(--color-grey-100)] bg-[var(--color-grey-50)] p-4">
          <h1 className="text-xl font-semibold mb-4">Active Users</h1>
          {activeUsers && activeUsers.length > 0 ? (
            <div>
              {activeUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                >
                  <div className="text-green-400">
                    <RiRadioButtonLine />
                  </div>
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[var(--color-grey-300)]">No active users</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;
