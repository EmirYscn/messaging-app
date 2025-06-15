import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Chats from "./Chats";
import { useState } from "react";
import { useAsideContext } from "../contexts/Aside/AsideContextProvider";
import Settings from "./Settings";
import Profile from "./Profile";
import Friends from "./FriendsList";
import FriendAdd from "./FriendAdd";

function AppLayout() {
  const [showChats, setShowChats] = useState(false);
  const { context } = useAsideContext();

  const renderAsideContent = () => {
    switch (context) {
      case "chats":
        return <Chats onToggleChats={handleToggleChats} />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile />;
      case "friends":
        return <Friends />;
      case "friend-add":
        return <FriendAdd />;
      default:
        return null;
    }
  };

  const handleToggleChats = () => {
    setShowChats((prev) => !prev);
  };

  return (
    // Container for centering with padding
    <div className="flex justify-center h-screen overflow-hidden lg:p-8 lg:opacity-95">
      {/* App container with max-width and rounded corners */}
      <div className="w-full lg:max-w-99/100 lg:rounded-2xl overflow-hidden grid grid-rows-[1fr_auto] lg:grid-rows-none lg:grid lg:grid-cols-[auto_25rem_1fr] relative bg-[var(--color-grey-50)] text-[var(--color-grey-700)] shadow-2xl">
        <div className="w-full lg:w-auto h-full rounded-xl lg:rounded-none lg:rounded-l-2xl overflow-hidden order-last lg:order-first border-t-2 border-[var(--color-grey-100)] lg:border-t-0 lg:border-r-2 ">
          <Sidebar onToggleChats={handleToggleChats} showChats={showChats} />
        </div>
        <div
          className={`
            ${showChats ? "block" : "hidden"}
              lg:block
              transition-all duration-300
              h-[calc(100dvh-4rem)]
              lg:border-[var(--color-grey-100)] lg:border-r-2
            `}
        >
          {renderAsideContent()}
        </div>

        <main
          className={`
              ${showChats ? "hidden" : "block"} 
              lg:block h-[calc(100dvh-4rem)]
            `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
