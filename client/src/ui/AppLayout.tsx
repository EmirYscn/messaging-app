import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Chats from "./Chats";
import { useState } from "react";

function AppLayout() {
  const [showChats, setShowChats] = useState(false);

  const handleToggleChats = () => {
    setShowChats((prev) => !prev);
  };

  return (
    // Container for centering with padding
    <div className="min-h-screen flex justify-center md:p-8">
      {/* App container with max-width and rounded corners */}
      <div className="w-full md:max-w-99/100 md:rounded-2xl overflow-hidden grid grid-rows lg:grid lg:grid-cols-[auto_auto_1fr] relative bg-[var(--color-grey-50)] text-[var(--color-grey-700)] shadow-lg">
        <div className="w-full lg:w-auto h-full rounded-xl lg:rounded-none lg:rounded-l-2xl overflow-hidden order-last lg:order-first border-t-2 border-[var(--color-grey-100)] lg:border-t-0 lg:border-r-2 ">
          <Sidebar onToggleChats={handleToggleChats} showChats={showChats} />
        </div>
        <div
          className={`
              ${showChats ? "block" : "hidden"}
              lg:block
              transition-all duration-300
              h-[calc(100vh-9rem)]  lg:h-[calc(100vh-4rem)] overflow-y-auto
              lg:border-[var(--color-grey-100)] lg:border-r-2 
            `}
        >
          <Chats onToggleChats={handleToggleChats} />
        </div>

        <main
          className={`
              ${showChats ? "hidden" : "block"} 
              lg:block
              h-[calc(100vh-9rem)]  lg:h-[calc(100vh-4rem)] overflow-y-auto
            `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
