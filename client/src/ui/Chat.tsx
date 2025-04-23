import { BiSelectMultiple } from "react-icons/bi";
import { RiInfoCardFill } from "react-icons/ri";

import Messages from "./Messages";
import ActiveUsersPanel from "./ActiveUsersPanel";
import MessageInput from "./MessageInput";
import SpinnerMini from "./SpinnerMini";

import { useChat } from "../hooks/useChat";
import { useSocketConnectionStatus } from "../hooks/useSocketConnectionStatus";
import { useSocketJoinRoom } from "../hooks/useSocketJoinRoom";
import Menus from "./Menus";

function Chat() {
  const { chat } = useChat();
  const { isConnected, errorMessage } = useSocketConnectionStatus();

  // Join the room when the component mounts
  useSocketJoinRoom();

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-full h-full">
        <div className="px-8 py-4 border-b-2 border-[var(--color-grey-100)] flex justify-between items-center gap-4">
          {isConnected ? (
            <h2 className="text-2xl font-semibold">{chat?.name}</h2>
          ) : (
            <>
              <span>{errorMessage}</span>
              <SpinnerMini />
            </>
          )}
          {chat && (
            <Menus>
              <Menus.Menu>
                <Menus.Toggle id={chat.id} />
                <Menus.List id={chat.id}>
                  <Menus.Button icon={<RiInfoCardFill />}>
                    <span className="text-sm">User info</span>
                  </Menus.Button>
                  <Menus.Button icon={<BiSelectMultiple />}>
                    <span className="text-sm">Select Messages</span>
                  </Menus.Button>
                </Menus.List>
              </Menus.Menu>
            </Menus>
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
