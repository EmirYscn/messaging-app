import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLeaveGroup } from "../hooks/useLeaveGroup";

type ContextMenu = {
  x: number;
  y: number;
  chatId: string;
  chatType: "GROUP" | "PRIVATE" | "PUBLIC";
} | null;

type ChatsCustomContextMenuProps = {
  contextMenu: ContextMenu;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenu>>;
};

function ChatsCustomContextMenu({
  contextMenu,
  setContextMenu,
}: ChatsCustomContextMenuProps) {
  const navigate = useNavigate();
  const { leaveGroup } = useLeaveGroup();

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [setContextMenu]);

  return (
    contextMenu && (
      <ul
        className="fixed z-50 w-40 bg-[var(--color-brand-100)]/85 rounded-md shadow-lg text-sm text-white [&_li]:cursor-pointer [&_li]:hover:bg-white/10 [&_li]:px-4"
        style={{ top: contextMenu.y, left: contextMenu.x }}
        onClick={() => setContextMenu(null)}
      >
        <li
          className="px-4 py-2 cursor-pointer"
          onClick={() => {
            navigate(`/chat/${contextMenu.chatId}`);
            setContextMenu(null);
          }}
        >
          View Chat
        </li>
        {contextMenu.chatType === "GROUP" && (
          <li
            className="px-4 py-2 cursor-pointer"
            onClick={() => leaveGroup(contextMenu.chatId)}
          >
            Leave Group
          </li>
        )}
        <li className="px-4 py-2  cursor-pointer">Delete</li>
      </ul>
    )
  );
}

export default ChatsCustomContextMenu;
