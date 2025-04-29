import { NavLink } from "react-router";
import Searchbar from "./Searchbar";
import { useChats } from "../hooks/useChats";
import ProfileImage from "./ProfileImage";

import { TfiWorld } from "react-icons/tfi";
import { useSocketChat } from "../hooks/useSocketChat";
import { formatDateToHour } from "../utils/formatDateToHour";
import ChatSkeleton from "./ChatSkeleton";

function Chats({ onToggleChats }: { onToggleChats?: () => void }) {
  const { chats, isLoading } = useChats();
  useSocketChat();

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-4xl font-semibold">Chats</h2>
        <button className="md:hidden" onClick={onToggleChats}>
          Close
        </button>
      </div>
      <Searchbar />
      <div className="flex flex-col gap-3 overflow-y-auto">
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
          <span>Public Chats</span>
        </NavLink>

        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ChatSkeleton key={i} />)
          : chats.map((chat) => (
              <NavLink
                to={`/chat/${chat.id}`}
                key={chat.id}
                onClick={onToggleChats}
                className={({ isActive }) =>
                  `text-md px-2 py-3 flex items-center gap-4 !transition-none rounded-md  ${
                    isActive ? "bg-[var(--color-grey-100)]" : ""
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
                  <span className="break-words opacity-70 line-clamp-1">
                    {chat?.lastMessage?.content}
                  </span>
                </div>
              </NavLink>
            ))}
      </div>
    </div>
  );
}

export default Chats;
