import ProfileImage from "./ProfileImage";
import Searchbar from "./Searchbar";

import { IoPersonAdd } from "react-icons/io5";

import Button from "./Button";

import { useState } from "react";
import { useSearchUsers } from "../hooks/useSearchUsers";
import { useDebounce } from "../hooks/useDebounce";
import { useSendFriendRequest } from "../hooks/useSendFriendRequest";
import { useUser } from "../hooks/useUser";
import { useFriends } from "../hooks/useFriends";
import { useSentFriendRequests } from "../hooks/useSentFriendRequests";
import { useReceivedFriendRequests } from "../hooks/useReceivedFriendRequests";
import { User as UserType } from "../types/types";
import { IoMdCheckmark } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useSocketFriends } from "../hooks/sockets/useSocketFriends";

function FriendAdd() {
  const { t } = useTranslation("common");
  const { sendRequest } = useSendFriendRequest();
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 300);
  const { users } = useSearchUsers(debouncedValue);

  useSocketFriends();

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h1 className="px-4 py-6 text-4xl font-semibold">{t("addFriend")}</h1>
        <div className="px-4 ">
          <Searchbar
            placeholder={t("searchUsers")}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto">
          {users && users.length > 0 ? (
            users?.map((user) => (
              <User
                key={user.id}
                user={user}
                onClick={() => sendRequest(user.id)}
              />
            ))
          ) : debouncedValue ? (
            <span className="px-4 font-semibold text-center">
              No User found
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FriendAdd;

function User({ user, onClick }: { user: UserType; onClick: () => void }) {
  const { user: currentUser } = useUser();
  const { friends } = useFriends();
  const { sentFriendRequests } = useSentFriendRequests();
  const { receivedFriendRequests } = useReceivedFriendRequests();

  const isFriend = (userId: string) => {
    // Check if the user is already a friend
    return friends?.some((friend) => friend.id === userId);
  };
  const isFriendRequestSent = (userId: string) => {
    // Check if a friend request has already been sent
    return sentFriendRequests?.some((request) => request.receiverId === userId);
  };
  const isFriendRequestReceived = (userId: string) => {
    // Check if a friend request has already been received
    return receivedFriendRequests?.some(
      (request) => request.senderId === userId
    );
  };

  const icon = isFriendRequestSent(user.id) ? (
    <IoMdCheckmark className="text-xl hover:scale-115" />
  ) : (
    <IoPersonAdd className="text-xl hover:scale-115" />
  );

  const isDisabled =
    !user ||
    user.id === currentUser?.id ||
    isFriend(user.id) ||
    isFriendRequestSent(user.id) ||
    isFriendRequestReceived(user.id);

  return (
    <div className="flex gap-2 border-b-1 border-[var(--color-grey-300)]">
      <div className="px-4 grow grid grid-cols-[auto_1fr] text-left gap-2 items-center ">
        <div className="px-3">
          <ProfileImage imgSrc={user?.avatar} size="xs" />
        </div>
        <div className="py-4 ">
          <span>{user?.username}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 px-4 ">
        <Button
          icon={icon}
          size="small"
          disabled={isDisabled}
          onClick={onClick}
        />
      </div>
    </div>
  );
}
