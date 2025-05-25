import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";

import Searchbar from "./Searchbar";
import Friends from "./Friends";
import SentFriendRequests from "./SentFriendRequests";
import ReceivedFriendRequests from "./ReceivedFriendRequests";

import { useSocketFriends } from "../hooks/sockets/useSocketFriends";

import { FriendsContextMenu as FriendsContextMenuType } from "./CustomContextMenus/FriendsContextMenu";
import { User } from "../types/types";
import { ContextMenuPosition } from "./CustomContextMenus/ContextMenu";

function FriendsList() {
  const { t } = useTranslation("common");

  const [searchbarValue, setSearchbarValue] = useState("");
  const friendsListRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<FriendsContextMenuType>(null);
  const [menuPosition, setMenuPosition] = useState<ContextMenuPosition>(null);

  useSocketFriends();

  const handleContextMenu = (e: React.MouseEvent, friend: User) => {
    e.preventDefault();

    const container = friendsListRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = 100;

    let x = e.clientX;
    let y = e.clientY;

    // Clamp X and Y so the menu stays inside the chat container
    if (x + menuWidth > rect.right) x = rect.right - menuWidth;
    if (y + menuHeight > rect.bottom) y = rect.bottom - menuHeight;

    setMenuPosition({ x, y });
    setContextMenu({
      friendId: friend.id,
    });
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h1 className="px-4 py-6 text-4xl font-semibold">{t("friends")}</h1>
        <div className="px-4 ">
          <Searchbar
            placeholder={t("searchFriends")}
            searchValue={searchbarValue}
            setSearchValue={setSearchbarValue}
          />
        </div>

        <div
          className="flex flex-col gap-1 overflow-y-auto"
          ref={friendsListRef}
        >
          <ReceivedFriendRequests searchbarValue={searchbarValue} />

          <SentFriendRequests searchbarValue={searchbarValue} />

          <Friends
            searchbarValue={searchbarValue}
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            onContextMenu={(e, friend) => handleContextMenu(e, friend)}
            position={menuPosition}
            setPosition={setMenuPosition}
          />
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
