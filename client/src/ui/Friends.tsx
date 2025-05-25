import { useFriends } from "../hooks/useFriends";

import ProfileImage from "./ProfileImage";

import FriendSkeleton from "./FriendSkeleton";
import { MouseEvent, User } from "../types/types";
import { useRef } from "react";
import FriendsContextMenu, {
  FriendsContextMenu as FriendsContextMenuType,
} from "./CustomContextMenus/FriendsContextMenu";
import { ContextMenuPosition } from "./CustomContextMenus/ContextMenu";

function Friends({
  filterList,
  hasCheckbox,
  onCheck,
  selectedUsers,
  searchbarValue,
  contextMenu,
  setContextMenu,
  onContextMenu,
  position,
  setPosition,
}: {
  filterList?: string[];
  hasCheckbox?: boolean;
  onCheck?: (user: User) => void;
  selectedUsers?: User[];
  searchbarValue?: string;
  contextMenu?: FriendsContextMenuType;
  setContextMenu?: React.Dispatch<React.SetStateAction<FriendsContextMenuType>>;
  onContextMenu?: (e: MouseEvent, friend: User) => void;
  position?: ContextMenuPosition;
  setPosition?: React.Dispatch<React.SetStateAction<ContextMenuPosition>>;
}) {
  const { friends, isLoading } = useFriends();

  const friendsListRef = useRef<HTMLDivElement>(null);

  // const [contextMenu, setContextMenu] = useState<FriendsContextMenuType>(null);

  let filteredFriends = friends;

  filteredFriends = filteredFriends?.filter((friend) => {
    if (filterList) {
      return !filterList?.includes(friend.id);
    }
    return true;
  });

  if (searchbarValue) {
    filteredFriends = filteredFriends?.filter((friend) =>
      friend?.username?.toLowerCase().includes(searchbarValue.toLowerCase())
    );
  }

  const isSelected = (friend: User) => {
    if (!selectedUsers) return false;
    return selectedUsers.some((user) => user.id === friend.id);
  };

  return (
    <>
      {" "}
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <FriendSkeleton key={i} variation="friends" />
          ))
        : filteredFriends?.map((friend) => (
            <div
              key={friend.id}
              className="hover:bg-[var(--color-grey-700)] px-4"
              ref={friendsListRef}
              onContextMenu={(e) => onContextMenu?.(e, friend)}
            >
              <div
                key={friend.id}
                className={`grid  ${
                  hasCheckbox
                    ? "grid-cols-[auto_1fr_auto]"
                    : "grid-cols-[auto_1fr]"
                } text-left gap-2 items-center`}
              >
                <div className="px-3 py-4 ">
                  <ProfileImage imgSrc={friend?.avatar} size="xs" />
                </div>
                <div className="py-4">
                  <span>{friend?.username}</span>
                </div>
                {hasCheckbox && (
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected(friend)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded-full appearance-none bg-[var(--color-grey-200)] focus:ring-2 focus:ring-green-500 checked:bg-green-600 checked:border-transparent"
                      onChange={(e) => {
                        e.stopPropagation();
                        if (onCheck) {
                          onCheck(friend);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
      {contextMenu && setContextMenu && position && setPosition && (
        <FriendsContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          position={position}
          setPosition={setPosition}
        />
      )}
    </>
  );
}

export default Friends;
