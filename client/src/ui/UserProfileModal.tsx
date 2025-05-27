import { useTranslation } from "react-i18next";
import { useUserProfile } from "../hooks/useUserProfile";
import ProfileImage from "./ProfileImage";
import { useUser } from "../hooks/useUser";
import { useChat } from "../hooks/useChat";
import Button from "./Button";
import { useSentFriendRequests } from "../hooks/useSentFriendRequests";
import { IoPersonAdd } from "react-icons/io5";
import { useFriends } from "../hooks/useFriends";
import { useReceivedFriendRequests } from "../hooks/useReceivedFriendRequests";
import { useSendFriendRequest } from "../hooks/useSendFriendRequest";
import { BiMessageDetail } from "react-icons/bi";
import { FaUserCheck, FaUserMinus } from "react-icons/fa";
import { useRemoveFriend } from "../hooks/useRemoveFriend";
import { useCreateChat } from "../hooks/useCreateChat";
import UserProfileCardSkeleton from "./skeletons/UserProfileCardSkeleton";

type ConfirmDeleteProps = {
  userId?: string;
  onConfirm?: (userIds: string[]) => void;
  disabled?: boolean;
  onCloseModal?: () => void;
};

export default function UserProfileModal({
  userId,
  onCloseModal,
}: ConfirmDeleteProps) {
  const { t: tCommon } = useTranslation("common");
  const { user: currentUser } = useUser();
  const { chat } = useChat();
  const oppositeUserId =
    userId || chat?.users?.find((user) => user.id !== currentUser?.id)?.id;
  const { profile, isLoading } = useUserProfile(oppositeUserId || "");

  const { sendRequest, isPending: isSendingFriendRequest } =
    useSendFriendRequest();
  const { removeFriend, isLoading: isRemovingFriend } = useRemoveFriend();

  const { friends } = useFriends();
  const { sentFriendRequests } = useSentFriendRequests();
  const { receivedFriendRequests } = useReceivedFriendRequests();
  const { createChat } = useCreateChat();

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

  const icon = isFriendRequestSent(oppositeUserId!) ? (
    <FaUserCheck className="text-xl hover:scale-115" />
  ) : (
    <IoPersonAdd className="text-xl hover:scale-115" />
  );

  const isDisabled =
    isSendingFriendRequest ||
    isFriendRequestSent(oppositeUserId!) ||
    isFriendRequestReceived(oppositeUserId!);

  if (isLoading) return <UserProfileCardSkeleton />;

  return (
    <div className="w-[20rem] md:w-[30rem] h-[30rem] flex flex-col rounded-lg">
      <div
        className="relative w-full h-50 bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage: `url('/chat-background.jpg')` }}
      >
        <div className="w-full flex items-center gap-4 absolute bottom-4 px-4">
          <ProfileImage imgSrc={profile?.user?.avatar} size="md" />
          <span className="font-semibold text-white">
            {profile?.user?.username}
          </span>
          <div className="flex items-center ml-auto text-white hover:text-white">
            <Button
              size="small"
              icon={<BiMessageDetail className="text-xl hover:scale-115" />}
              onClick={() => {
                createChat(oppositeUserId!);
                onCloseModal?.();
              }}
            />
            {isFriend(oppositeUserId!) ? (
              <Button
                className=""
                icon={<FaUserMinus className="text-xl hover:scale-115" />}
                size="small"
                disabled={isRemovingFriend}
                onClick={() => removeFriend(oppositeUserId!)}
              />
            ) : (
              <Button
                className=""
                icon={icon}
                size="small"
                disabled={isDisabled}
                onClick={() => sendRequest(oppositeUserId!)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="grow p-4 shadow-md bg-gradient-to-br from-blue-100 via-blue-300 to-gray-800 rounded-b-lg">
        <span className="text-md text-[var(--color-grey-700)] font-semibold">
          {profile?.bio || tCommon("noBio")}
        </span>
      </div>
    </div>
  );
}
