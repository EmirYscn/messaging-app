import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { useFriends } from "../hooks/useFriends";
import Menus from "./Menus";
import ProfileImage from "./ProfileImage";
import { MdDelete } from "react-icons/md";
import { useCreateChat } from "../hooks/useCreateChat";
import { useRemoveFriend } from "../hooks/useRemoveFriend";
import FriendSkeleton from "./FriendSkeleton";
import { User } from "../types/types";

function Friends({
  filterList,
  hasCheckbox,
  onCheck,
  selectedUsers,
  searchbarValue,
}: {
  filterList?: string[];
  hasCheckbox?: boolean;
  onCheck?: (user: User) => void;
  selectedUsers?: User[];
  searchbarValue?: string;
}) {
  const { friends, isLoading } = useFriends();
  const { createChat } = useCreateChat();
  const { removeFriend } = useRemoveFriend();

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
            <div key={friend.id}>
              <Menus>
                <Menus.Menu>
                  <Menus.Toggle id={friend?.id}>
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
                  </Menus.Toggle>

                  {!hasCheckbox && (
                    <Menus.List id={friend?.id}>
                      <Menus.Button
                        icon={<BiSolidMessageSquareAdd />}
                        onClick={() => createChat(friend.id)}
                      >
                        Send Message
                      </Menus.Button>
                      <Menus.Button
                        icon={<MdDelete />}
                        onClick={() => removeFriend(friend?.id)}
                      >
                        Remove Friend
                      </Menus.Button>
                    </Menus.List>
                  )}
                </Menus.Menu>
              </Menus>
            </div>
          ))}
    </>
  );
}

export default Friends;
