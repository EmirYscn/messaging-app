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
import NewChatIcon from "./icons/NewChatIcon";

function Chats({ onToggleChats }: { onToggleChats?: () => void }) {
  const { t } = useTranslation("common");
  const { setContext } = useAsideContext();
  const [searchValue, setSearchValue] = useState("");
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

  const filteredChats = chats.filter((chat) =>
    chat?.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

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
                icon={<NewChatIcon />}
              />
            </div>
          </div>
          <Searchbar
            placeholder={t("searchChats")}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <div
            className="flex flex-col gap-3 overflow-y-auto"
            style={{ scrollbarGutter: "stable" }}
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
              : filteredChats.map((chat) => (
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
