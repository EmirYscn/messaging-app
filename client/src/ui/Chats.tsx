import { NavLink } from "react-router";
import Searchbar from "./Searchbar";
import { useChats } from "../hooks/useChats";
import ProfileImage from "./ProfileImage";

import { TfiWorld } from "react-icons/tfi";

function Chats({ onToggleChats }: { onToggleChats?: () => void }) {
  const { chats } = useChats();

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-semibold mb-4">Chats</h2>
        <button className="md:hidden" onClick={onToggleChats}>
          Close
        </button>
      </div>
      <Searchbar />
      <div className="flex flex-col gap-3 ">
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
                isActive ? "bg-[var(--color-grey-100)] font-semibold" : ""
              }`
            }
          >
            <ProfileImage imgSrc={chat?.avatar} size="xs" />
            <span>{chat?.name}</span>
          </NavLink>
        ))}
        {/* <NavLink
          to={"/chat/225cddc9-f874-42e3-ba3c-3fe880dcfd4c"}
          className={({ isActive }) =>
            `text-md px-2 py-3 flex items-center gap-4 !transition-none rounded-md  ${
              isActive ? "bg-[var(--color-grey-100)] font-semibold" : ""
            }`
          }
        >
          <span>Photo</span>
          <span>Yusuf</span>
        </NavLink>
        <NavLink
          to={"/chat/2"}
          className={({ isActive }) =>
            `text-md px-2 py-3 flex items-center gap-4 !transition-none rounded-md  ${
              isActive ? "bg-[var(--color-grey-100)] font-semibold" : ""
            }`
          }
        >
          <span>Photo</span>
          <span>Chat1</span>
        </NavLink>
        <NavLink
          to={"/chat/3"}
          className={({ isActive }) =>
            `text-md px-2 py-3 flex items-center gap-4 !transition-none rounded-md  ${
              isActive ? "bg-[var(--color-grey-100)] font-semibold" : ""
            }`
          }
        >
          <span>Photo</span>
          <span>Chat1</span>
        </NavLink> */}
      </div>
    </div>
  );
}

export default Chats;
