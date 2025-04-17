import Messages from "./Messages";
import { useChat } from "../hooks/useChat";
import { useEffect, useState } from "react";

import { User } from "../types/types";
import { socket } from "../services/socket";
import ActiveUsersPanel from "./ActiveUsersPanel";
import MessageInput from "./MessageInput";

function Chat() {
  const { chat } = useChat();

  const [activeUsers, setActiveUsers] = useState<User[] | null>([]);

  // Join the room when the component mounts
  useEffect(() => {
    socket.emit("join_room", { chatId: chat?.id, chatType: chat?.type });

    return () => {
      socket.emit("leave_room", { chatId: chat?.id, chatType: chat?.type });
    };
  }, [chat?.id, chat?.type]);

  useEffect(() => {
    const handleAddToActiveUsers = (data: User) => {
      console.log("in add", data);

      setActiveUsers((prev) => {
        if (prev) {
          const userExists = prev.some((user) => user.id === data.id);
          if (!userExists) {
            return [...prev, data];
          }
        }
        return prev;
      });
    };

    const handleRemoveFromActiveUsers = (data: User) => {
      console.log("in remove", data);
      const updatedActiveUsers = activeUsers?.filter(
        (user) => user.id !== data?.id
      );
      setActiveUsers(updatedActiveUsers!);
    };

    const handleInitialActiveUsers = (users: User[]) => {
      setActiveUsers(users);
    };

    // Listen for incoming messages
    socket.on("active_users_list", handleInitialActiveUsers);
    socket.on("add_to_active_users", handleAddToActiveUsers);
    socket.on("remove_from_active_users", handleRemoveFromActiveUsers);

    // Cleanup function to remove the listeners
    return () => {
      socket.off("add_to_active_users", handleAddToActiveUsers);
      socket.off("remove_from_active_users", handleRemoveFromActiveUsers);
    };
  }, [activeUsers]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-full h-full">
        <div className="p-4 border-b-2 border-[var(--color-grey-100)] flex items-center gap-4">
          <h2 className="text-4xl font-semibold ">{chat?.name}</h2>
        </div>

        <div className="flex-grow overflow-y-auto">
          <Messages />
        </div>

        <MessageInput chat={chat!} />
      </div>

      {/* Right: Active Users Panel */}
      {chat?.type === "PUBLIC" && (
        <ActiveUsersPanel activeUsers={activeUsers} />
      )}
    </div>
  );
}

export default Chat;
