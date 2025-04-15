import { FaUser } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdGroups2 } from "react-icons/md";
import DarkModeToggle from "./DarkModeToggle";

function Sidebar({ onToggleChats, showChats }) {
  return (
    <aside className="w-full h-full flex justify-center gap-8 md:flex-row lg:flex-col lg:justify-between items-center p-4 shadow-md">
      <div className="flex lg:flex-col gap-8 items-center text-2xl ">
        <button
          onClick={onToggleChats}
          className={`px-3 py-1 rounded ${showChats ? "bg-gray-200" : ""}`}
        >
          <IoMdChatbubbles />
        </button>
        <button>
          <MdGroups2 />
        </button>
      </div>
      <div className="flex lg:flex-col gap-8 items-center text-2xl ">
        <button>
          <IoSettingsOutline />
        </button>
        <DarkModeToggle />
        <button>
          <FaUser />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
