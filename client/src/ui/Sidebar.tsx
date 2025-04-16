import { IoMdChatbubbles } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdGroups2 } from "react-icons/md";
import DarkModeToggle from "./DarkModeToggle";
import { useUser } from "../hooks/useUser";
import ProfileImage from "./ProfileImage";
import { NavLink } from "react-router";
import { useAsideContext } from "../contexts/Aside/AsideContextProvider";

function Sidebar({ onToggleChats, showChats }) {
  const { user } = useUser();
  const { setContext } = useAsideContext();

  const handleToggleChats = () => {
    onToggleChats();
    setContext("chats");
  };

  return (
    <aside className="w-full h-full flex justify-center gap-8 md:flex-row lg:flex-col lg:justify-between items-center p-6 shadow-md">
      <div className="flex lg:flex-col gap-8 items-center text-2xl ">
        <button
          onClick={handleToggleChats}
          className={`px-3 py-1 rounded-4xl ${
            showChats ? "bg-[var(--color-grey-100)]" : ""
          }`}
        >
          <IoMdChatbubbles />
        </button>
        <NavLink to={"/contacts"}>
          <MdGroups2 />
        </NavLink>
      </div>
      <div className="flex lg:flex-col gap-8 items-center text-2xl ">
        <button onClick={() => setContext("settings")}>
          <IoSettingsOutline />
        </button>
        <DarkModeToggle />
        <NavLink to="/settings/profile">
          <ProfileImage imgSrc={user?.avatar} size="xs" />
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
