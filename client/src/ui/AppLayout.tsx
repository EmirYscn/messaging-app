import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Chats from "./Chats";
import { useState } from "react";
import { useAsideContext } from "../contexts/Aside/AsideContextProvider";
import Settings from "./Settings";
import Profile from "./Profile";
import Friends from "./FriendsList";
import FriendAdd from "./FriendAdd";
import { useDarkMode } from "../contexts/DarkMode/ThemeContextProvider";
import NewChat from "./NewChatPanel";
import NewGroupPanel from "./NewGroupPanel";
import NewGroupPanelFinal from "./NewGroupPanelFinal";

import { AnimatePresence, motion } from "framer-motion";

function AppLayout() {
  const [showChats, setShowChats] = useState(false);
  const { context, setContext } = useAsideContext();
  const { isDarkMode } = useDarkMode();

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
      case "new-chat":
        return <NewChat onBack={() => setContext("chats")} />;
      case "new-group-chat":
        return <NewGroupPanel onBack={() => setContext("new-chat")} />;
      case "new-group-chat-final":
        return (
          <NewGroupPanelFinal onBack={() => setContext("new-group-chat")} />
        );
      default:
        return null;
    }
  };

  const handleToggleChats = () => {
    setShowChats((prev) => !prev);
  };

  return (
    // Container for centering with padding
    <div className="flex justify-center h-screen overflow-hidden lg:p-8">
      {/* App container with max-width and rounded corners */}
      <div
        className={`w-full lg:max-w-99/100 lg:rounded-2xl overflow-hidden grid grid-rows-[1fr_auto] lg:grid-rows-none lg:grid lg:grid-cols-[auto_25rem_1fr] relative ${
          isDarkMode
            ? "bg-[var(--color-grey-50)]/85"
            : "bg-[var(--color-grey-50)]/60"
        }  backdrop-blur-sm text-[var(--color-grey-700)] shadow-2xl`}
      >
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
          <AnimatePresence mode="wait">
            <motion.div
              key={context}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {renderAsideContent()}
            </motion.div>
          </AnimatePresence>
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
