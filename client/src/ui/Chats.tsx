import { NavLink } from "react-router";
import Searchbar from "./Searchbar";
import { useChats } from "../hooks/useChats";
import ProfileImage from "./ProfileImage";

import { TfiWorld } from "react-icons/tfi";
import { useSocketChat } from "../hooks/useSocketChat";
import { formatDateToHour } from "../utils/formatDateToHour";

function Chats({ onToggleChats }: { onToggleChats?: () => void }) {
  const { chats } = useChats();
  useSocketChat();

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-semibold mb-4">Chats</h2>
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

        {chats.map((chat) => (
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
              <div className="flex justify-between items-center">
                <span className="font-medium text-[15px] truncate">
                  {chat?.name}
                </span>
                {chat?.lastMessage?.createdAt && (
                  <span className="text-xs opacity-60 whitespace-nowrap">
                    {formatDateToHour(chat?.lastMessage?.createdAt)}
                  </span>
                )}
              </div>
              <span className="opacity-70 break-words line-clamp-1">
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
