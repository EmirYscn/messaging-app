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
    <div className="min-h-screen  flex justify-center p-4 md:p-8">
      {/* App container with max-width and rounded corners */}
      <div className="w-full max-w-99/100 rounded-2xl overflow-hidden flex flex-col md:flex-row relative bg-[var(--color-grey-50)] text-[var(--color-grey-700)] shadow-lg">
        {/* Main content area (flex on mobile, grid on larger screens) */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-[auto_1fr] lg:grid-cols-[400px_1fr]">
          {/* Chats section - hidden by default on small screens unless toggled */}
          <div
            className={`
              ${showChats ? "block" : "hidden"}
              md:block
              transition-all duration-300
              h-[calc(100vh-9rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto
            `}
          >
            <Chats onToggleChats={handleToggleChats} />
          </div>

          {/* Main content - visible by default on small screens unless chats toggled */}
          <main
            className={`
              ${showChats ? "hidden" : "block"} 
              md:block
              h-[calc(100vh-9rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto
            `}
          >
            <Outlet />
          </main>
        </div>

        {/* Sidebar - fixed at bottom on small/medium screens, left side on large screens */}

        <div className="w-full lg:w-auto h-full rounded-xl lg:rounded-none lg:rounded-l-2xl overflow-hidden">
          <Sidebar onToggleChats={handleToggleChats} showChats={showChats} />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
