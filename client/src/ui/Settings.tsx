import { useUser } from "../hooks/useUser";
import ProfileImage from "./ProfileImage";
import Searchbar from "./Searchbar";
import { FaUserCircle } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { BsBellFill } from "react-icons/bs";

function Settings() {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4 h-full">
      <h1 className="px-4 py-6 text-3xl font-semibold mb-2">Settings</h1>
      <div className="px-4 ">
        <Searchbar placeholder="Search in the settings" />
      </div>
      <div className="px-4 py-2 flex gap-4 items-center hover:bg-[var(--color-grey-100)]">
        <ProfileImage imgSrc={user?.avatar} size="md" />
        <h2 className="text-xl">{user?.username}</h2>
      </div>
      <div className="flex flex-col gap-3">
        <button className=" grid grid-cols-[auto_1fr] text-left gap-1 items-center hover:bg-[var(--color-grey-100)] ">
          <div className="px-6 py-4">
            <span className="text-2xl">
              <FaUserCircle />
            </span>
          </div>
          <div className=" py-4  border-b-1 border-b-[var(--color-grey-200)]">
            <span>Account</span>
          </div>
        </button>
        <button className="grid grid-cols-[auto_1fr] text-left gap-1 items-center hover:bg-[var(--color-grey-100)]">
          <div className="px-6 py-4">
            <span className="text-2xl">
              <BsBellFill />
            </span>
          </div>
          <div className=" py-4  border-b-1 border-b-[var(--color-grey-200)]">
            <span>Notifications</span>
          </div>
        </button>
        <button className="grid grid-cols-[auto_1fr] text-left gap-1 items-center text-red-400 hover:bg-[var(--color-grey-100)]">
          <div className="px-6 py-4">
            <span className="text-2xl">
              <PiSignOutBold />
            </span>
          </div>
          <div className=" py-4 ">
            <span>Sign out</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Settings;
