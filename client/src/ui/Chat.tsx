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
import ProfileImage from "./ProfileImage";
import { IoMdExit } from "react-icons/io";
import { useLeaveGroup } from "../hooks/useLeaveGroup";
import { IoPersonAdd } from "react-icons/io5";

function Chat() {
  const { t } = useTranslation("chats");
  const { chat } = useChat();
  const { isConnected, errorMessage } = useSocketConnectionStatus();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const { deleteMessages, isLoading: isDeleting } = useDeleteMessages();
  const { leaveGroup, isPending: isLeavingGroup } = useLeaveGroup();

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
            <div className="flex items-center gap-5">
              <ProfileImage imgSrc={chat?.avatar} size="sm" />
              <div>
                <h2 className="text-2xl font-semibold">
                  {chat?.type === "PUBLIC" ? t(`${chat?.name}`) : chat?.name}
                </h2>
                {chat?.type === "GROUP" && chat?.users && (
                  <div className="flex flex-wrap gap-2">
                    {chat.users.slice(0, 4).map((user, index, arr) => (
                      <span
                        key={user.id}
                        className="text-sm text-[var(--color-grey-400)] max-w-[100px] truncate"
                      >
                        {user.username}
                        {index < arr.length - 1 && ","}
                      </span>
                    ))}
                    {chat.users.length > 4 && (
                      <span className="text-sm text-[var(--color-grey-400)]">
                        +{chat.users.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
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
                disabled={selectedMessages.length === 0 || isDeleting}
              />
            )}
            {chat && (
              <Menus>
                <Menus.Menu>
                  <Menus.Toggle id={chat.id} />
                  <Menus.List id={chat.id}>
                    {chat?.type === "PRIVATE" && (
                      <Menus.Button icon={<RiInfoCardFill />}>
                        <span className="text-sm">User info</span>
                      </Menus.Button>
                    )}
                    {chat?.type === "GROUP" && (
                      <Menus.Button icon={<IoPersonAdd />}>
                        <span className="text-sm">{t("addUser")}</span>
                      </Menus.Button>
                    )}
                    <Menus.Button
                      icon={<BiSelectMultiple />}
                      onClick={handleSelecting}
                      disabled={isDeleting}
                    >
                      <span className="text-sm">
                        {isSelecting ? t("cancel") : t("selectMessages")}
                      </span>
                    </Menus.Button>
                    {chat.type === "GROUP" && (
                      <Menus.Button
                        icon={<IoMdExit />}
                        onClick={() => leaveGroup(chat.id)}
                        disabled={isLeavingGroup}
                      >
                        <span className="text-sm">{t("leaveGroup")}</span>
                      </Menus.Button>
                    )}
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
