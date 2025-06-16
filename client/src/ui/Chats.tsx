import { NavLink } from "react-router";
import Searchbar from "./Searchbar";
import { useChats } from "../hooks/useChats";
import ProfileImage from "./ProfileImage";

import { TfiWorld } from "react-icons/tfi";
import { useSocketChat } from "../hooks/sockets/useSocketChat";
import { formatDateToHour } from "../utils/formatDateToHour";
import ChatSkeleton from "./skeletons/ChatSkeleton";
import { useTranslation } from "react-i18next";

import { useRef, useState } from "react";
import Button from "./Button";
import ChatsContextMenu, {
  ChatsContextMenu as ChatsContextMenuType,
} from "./custom-context-menus/ChatsContextMenu";
import { Chat, MESSAGE_TYPE } from "../types/types";
import { ContextMenuPosition } from "./custom-context-menus/ContextMenu";
import { FaCamera } from "react-icons/fa";
import { useAsideContext } from "../contexts/Aside/AsideContextProvider";

function Chats({ onToggleChats }: { onToggleChats?: () => void }) {
  const { t } = useTranslation("common");
  const { setContext } = useAsideContext();

  const { chats, isLoading } = useChats();
  useSocketChat();

  const chatListRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<ChatsContextMenuType>(null);
  const [menuPosition, setMenuPosition] = useState<ContextMenuPosition>(null);

  const handleContextMenu = (e: React.MouseEvent, chat: Chat) => {
    e.preventDefault();

    const container = chatListRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = 100;

    let x = e.clientX;
    let y = e.clientY;

    // Clamp X and Y so the menu stays inside the chat container
    if (x + menuWidth > rect.right) x = rect.right - menuWidth;
    if (y + menuHeight > rect.bottom) y = rect.bottom - menuHeight;

    setMenuPosition({ x, y });
    setContextMenu({
      chatId: chat.id,
      chatType: chat.type,
    });
  };

  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute top-0 left-0 z-10 w-full h-full">
        <div className="flex flex-col h-full gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-semibold">{t("chats")}</h2>
            <div className="flex items-center gap-2">
              <Button
                className="!p-2"
                onClick={() => setContext("new-chat")}
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    preserveAspectRatio="xMidYMid meet"
                    fill="none"
                  >
                    <title>new-chat-outline</title>
                    <path
                      d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                }
              />
            </div>
          </div>
          <Searchbar />
          <div
            className="flex flex-col gap-3 overflow-y-auto "
            ref={chatListRef}
          >
            <NavLink
              to={"/"}
              onClick={onToggleChats}
              className={({ isActive }) =>
                `text-md px-2 py-3 flex items-center gap-4 !transition-none border-b-1 border-[var(--color-grey-300)]  ${
                  isActive
                    ? "bg-[var(--color-blue-100)] font-bold"
                    : "font-semibold"
                }`
              }
            >
              <ProfileImage context="chats" size="xs">
                <TfiWorld />
              </ProfileImage>
              <span>{t("publicChats")}</span>
            </NavLink>

            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ChatSkeleton key={i} />
                ))
              : chats.map((chat) => (
                  <NavLink
                    to={`/chat/${chat.id}`}
                    key={chat.id}
                    onClick={onToggleChats}
                    onContextMenu={(e) => handleContextMenu(e, chat)}
                    className={({ isActive }) =>
                      `text-md px-2 py-3 flex items-center gap-4 !transition-none rounded-md  ${
                        isActive ? "bg-[var(--color-grey-100)]/30" : ""
                      }`
                    }
                  >
                    <ProfileImage imgSrc={chat?.avatar} size="xs" />
                    <div className="flex flex-col w-full overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[15px] truncate">
                          {chat?.name}
                        </span>
                        {chat?.lastMessage?.createdAt && (
                          <span className="text-xs opacity-60 whitespace-nowrap">
                            {formatDateToHour(chat?.lastMessage?.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {chat?.lastMessage?.type === MESSAGE_TYPE.IMAGE ? (
                          <div className="flex items-center gap-2">
                            <FaCamera className="text-md" />
                            <span className="opacity-70 line-clamp-1 break-words">
                              {t("photo")}
                            </span>
                          </div>
                        ) : (
                          <span className="opacity-70 line-clamp-1 break-words">
                            {chat?.lastMessage?.content}
                          </span>
                        )}
                      </div>
                    </div>
                  </NavLink>
                ))}

            <ChatsContextMenu
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              position={menuPosition}
              setPosition={setMenuPosition}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;
