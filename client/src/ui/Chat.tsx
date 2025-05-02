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
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Button from "./Button";
import { BsFillTrashFill } from "react-icons/bs";
import { useDeleteMessages } from "../hooks/useDeleteMessages";

function Chat() {
  const { t } = useTranslation("chats");
  const { chat } = useChat();
  const { isConnected, errorMessage } = useSocketConnectionStatus();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const { deleteMessages } = useDeleteMessages();

  function handleSelecting() {
    setSelectedMessages([]);
    setIsSelecting(!isSelecting);
  }

  function handleDeleteMessages() {
    if (selectedMessages.length > 0) {
      deleteMessages(selectedMessages);
      setSelectedMessages([]);
      setIsSelecting(false);
    }
  }

  // Join the room when the component mounts
  useSocketJoinRoom();

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-full h-full">
        <div className="px-8 py-4 border-b-2 border-[var(--color-grey-100)] flex justify-between items-center gap-4">
          {isConnected ? (
            <h2 className="text-2xl font-semibold">
              {t(`${chat?.name}`) || chat?.name}
            </h2>
          ) : (
            <div className="flex items-center gap-2">
              <span>{errorMessage}</span>
              <SpinnerMini />
            </div>
          )}
          <div className="flex items-center">
            {isSelecting && (
              <Button
                icon={<BsFillTrashFill />}
                className="text-[1rem] hover:text-red-500"
                onClick={handleDeleteMessages}
                disabled={selectedMessages.length === 0}
              />
            )}
            {chat && (
              <Menus>
                <Menus.Menu>
                  <Menus.Toggle id={chat.id} />
                  <Menus.List id={chat.id}>
                    <Menus.Button icon={<RiInfoCardFill />}>
                      <span className="text-sm">User info</span>
                    </Menus.Button>
                    <Menus.Button
                      icon={<BiSelectMultiple />}
                      onClick={handleSelecting}
                    >
                      <span className="text-sm">
                        {isSelecting ? t("cancel") : t("selectMessages")}
                      </span>
                    </Menus.Button>
                  </Menus.List>
                </Menus.Menu>
              </Menus>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <Messages
            isSelecting={isSelecting}
            setSelectedMessages={setSelectedMessages}
          />
        </div>

        {chat && <MessageInput chat={chat} isConnected={isConnected} />}
      </div>

      {/* Right: Active Users Panel */}
      {chat?.type === "PUBLIC" && <ActiveUsersPanel />}
    </div>
  );
}

export default Chat;
