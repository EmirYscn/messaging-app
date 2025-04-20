import Messages from "./Messages";
import { useChat } from "../hooks/useChat";
import { useEffect } from "react";

import { socket } from "../services/socket";
import ActiveUsersPanel from "./ActiveUsersPanel";
import MessageInput from "./MessageInput";
import SpinnerMini from "./SpinnerMini";
import { useSocketConnectionStatus } from "../hooks/useSocketConnectionStatus";

function Chat() {
  const { chat } = useChat();
  const isConnected = useSocketConnectionStatus();

  // Join the room when the component mounts
  useEffect(() => {
    if (!chat?.id || !chat?.type) return;

    socket.emit("join_room", { chatId: chat.id, chatType: chat.type });

    return () => {
      socket.emit("leave_room", { chatId: chat.id, chatType: chat.type });
    };
  }, [chat?.id, chat?.type]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-full h-full">
        <div className="p-4 border-b-2 border-[var(--color-grey-100)] flex items-center gap-4">
          {isConnected ? (
            <h2 className="text-4xl font-semibold">{chat?.name}</h2>
          ) : (
            <>
              <span>Trying to reconnect...</span>
              <SpinnerMini />
            </>
          )}
        </div>

        <div className="flex-grow overflow-y-auto">
          <Messages />
        </div>

        {chat && <MessageInput chat={chat} isConnected={isConnected} />}
      </div>

      {/* Right: Active Users Panel */}
      {chat?.type === "PUBLIC" && <ActiveUsersPanel />}
    </div>
  );
}

export default Chat;
