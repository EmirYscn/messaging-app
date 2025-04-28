import { IoMdChatbubbles } from "react-icons/io";
import { IoPersonAddSharp, IoSettingsOutline } from "react-icons/io5";

import { useUser } from "../hooks/useUser";
import ProfileImage from "./ProfileImage";
import { useAsideContext } from "../contexts/Aside/AsideContextProvider";
import { ContextTypes } from "../contexts/Aside/AsideContext";
import { FaUserFriends } from "react-icons/fa";

function Sidebar({
  onToggleChats,
}: {
  onToggleChats: () => void;
  showChats: boolean;
}) {
  const { user } = useUser();

  const { context, setContext } = useAsideContext();

  const handleToggleChats = (newContext: ContextTypes) => {
    onToggleChats();
    setContext(newContext);
  };

  return (
    <aside className="w-full h-full flex justify-center gap-8 md:flex-row lg:flex-col lg:justify-between items-center p-6 shadow-md">
      <div className="flex lg:flex-col gap-8 items-center text-2xl ">
        <button
          onClick={() => handleToggleChats("chats")}
          className={`px-3 py-3 rounded-4xl ${
            context === "chats" ? "bg-[var(--color-grey-100)]" : ""
          }`}
        >
          <IoMdChatbubbles />
        </button>
        <button
          onClick={() => handleToggleChats("friends")}
          className={`px-3 py-3 rounded-4xl ${
            context === "friends" ? "bg-[var(--color-grey-100)]" : ""
          }`}
        >
          <FaUserFriends />
        </button>
        <button
          onClick={() => handleToggleChats("friend-add")}
          className={`px-3 py-3 rounded-4xl ${
            context === "friend-add" ? "bg-[var(--color-grey-100)]" : ""
          }`}
        >
          <IoPersonAddSharp />
        </button>
      </div>
      <div className="flex lg:flex-col gap-8 items-center text-2xl ">
        <button
          onClick={() => handleToggleChats("settings")}
          className={`px-3 py-3 rounded-4xl ${
            context === "settings" ? "bg-[var(--color-grey-100)]" : ""
          }`}
        >
          <IoSettingsOutline />
        </button>
        <button
          onClick={() => handleToggleChats("profile")}
          className={`px-3 py-3 rounded-4xl ${
            context === "profile" ? "bg-[var(--color-grey-100)]" : ""
          }`}
        >
          <ProfileImage imgSrc={user?.avatar} size="xs" />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
