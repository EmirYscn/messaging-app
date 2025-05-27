import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLeaveGroup } from "../../hooks/useLeaveGroup";
import ContextMenu, { ContextMenuPosition } from "./ContextMenu";

export type ChatsContextMenu = {
  chatId: string;
  chatType: "GROUP" | "PRIVATE" | "PUBLIC";
} | null;

type ChatsContextMenuProps = {
  contextMenu: ChatsContextMenu;
  setContextMenu: React.Dispatch<React.SetStateAction<ChatsContextMenu>>;
  position: ContextMenuPosition;
  setPosition: React.Dispatch<React.SetStateAction<ContextMenuPosition>>;
};

function ChatsContextMenu({
  contextMenu,
  setContextMenu,
  position,
  setPosition,
}: ChatsContextMenuProps) {
  const navigate = useNavigate();
  const { leaveGroup } = useLeaveGroup();

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [setContextMenu]);

  if (!contextMenu) return null;

  const { chatId, chatType } = contextMenu;

  const menuItems = [
    {
      key: "view_chat",
      label: "View Chat",
      onClick: () => {
        navigate(`/chat/${contextMenu?.chatId}`);
      },
    },
    ...(chatType === "GROUP"
      ? [
          {
            key: "leave_group",
            label: "Leave Group",
            onClick: () => leaveGroup(chatId),
          },
        ]
      : []),
    {
      key: "delete",
      label: "Delete",
      onClick: () => {
        // TODO: implement delete handler
        console.log("Delete chat", chatId);
      },
    },
  ];

  return (
    <ContextMenu
      items={menuItems}
      position={position}
      setPosition={setPosition}
    />
  );
}

export default ChatsContextMenu;
