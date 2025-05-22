import { useEffect } from "react";
import { useRemoveFriend } from "../../hooks/useRemoveFriend";
import { useCreateChat } from "../../hooks/useCreateChat";
import ContextMenu, { ContextMenuPosition } from "./ContextMenu";

export type FriendsContextMenu = {
  friendId: string;
} | null;

type FriendsContextMenuProps = {
  contextMenu: FriendsContextMenu;
  setContextMenu: React.Dispatch<React.SetStateAction<FriendsContextMenu>>;
  position: ContextMenuPosition;
  setPosition: React.Dispatch<React.SetStateAction<ContextMenuPosition>>;
};

function FriendsContextMenu({
  contextMenu,
  setContextMenu,
  position,
  setPosition,
}: FriendsContextMenuProps) {
  const { removeFriend } = useRemoveFriend();
  const { createChat } = useCreateChat();

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [setContextMenu]);

  if (!contextMenu) return null;

  const { friendId } = contextMenu;

  const menuItems = [
    {
      key: "send_message",
      label: "Send Message",
      onClick: () => {
        createChat(friendId);
      },
    },
    {
      key: "remove_friend",
      label: "Remove Friend",
      onClick: () => {
        removeFriend(friendId);
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

export default FriendsContextMenu;
