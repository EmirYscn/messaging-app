import { BiSolidMessageSquareAdd } from "react-icons/bi";

import { IoMdCheckmark, IoMdClose } from "react-icons/io";

import ProfileImage from "./ProfileImage";
import Searchbar from "./Searchbar";
import Menus from "./Menus";
import Button from "./Button";

import { useFriends } from "../hooks/useFriends";
import { useCreateChat } from "../hooks/useCreateChat";
import { useReceivedFriendRequests } from "../hooks/useReceivedFriendRequests";
import { useSentFriendRequests } from "../hooks/useSentFriendRequests";
import { useUpdateFriendRequest } from "../hooks/useUpdateFriendRequest";
import { useDeleteFriendRequest } from "../hooks/useDeleteFriendRequest";
import { MdDelete } from "react-icons/md";
import { useRemoveFriend } from "../hooks/useRemoveFriend";
import FriendSkeleton from "./FriendSkeleton";
import { useTranslation } from "react-i18next";
import { useSocketFriends } from "../hooks/useSocketFriends";

function Friends() {
  const { t } = useTranslation("common");
  const { friends, isLoading: isFriendsLoading } = useFriends();
  const { createChat } = useCreateChat();

  const { receivedFriendRequests, isLoading: isReceivedRequestsLoading } =
    useReceivedFriendRequests();
  const { sentFriendRequests, isLoading: isSentRequestsLoading } =
    useSentFriendRequests();

  const { update, isLoading: isUpdatingRequest } = useUpdateFriendRequest();

  const { deleteRequest, isLoading: isDeletingRequest } =
    useDeleteFriendRequest();

  const { removeFriend } = useRemoveFriend();

  useSocketFriends();

  const statusClass = {
    PENDING: "bg-[var(--color-brand-100)] text-gray-200",
    ACCEPTED: "bg-[var(--color-green-700)] text-[var(--color-grey-50)]",
    DECLINED: "bg-[var(--color-red-700)] text-gray-200",
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h1 className="px-4 py-6 text-4xl font-semibold">{t("friends")}</h1>
        <div className="px-4 ">
          <Searchbar placeholder={t("searchFriends")} />
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto">
          {isReceivedRequestsLoading
            ? Array.from({ length: 1 }).map((_, i) => (
                <FriendSkeleton key={i} variation="received" />
              ))
            : receivedFriendRequests?.map((request) => (
                <div key={request.id}>
                  <h3 className="px-4 py-3 text-xl font-semibold">
                    Received Requests
                  </h3>
                  <div className="flex gap-2 border-b-1 border-[var(--color-grey-300)]">
                    <div className="px-4 grow grid grid-cols-[auto_1fr] text-left gap-2 items-center ">
                      <div className="px-3">
                        <ProfileImage
                          imgSrc={request?.sender.avatar}
                          size="xs"
                        />
                      </div>
                      <div className="py-4 ">
                        <span>{request?.sender.username}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-4 ">
                      <Button
                        icon={
                          <IoMdCheckmark className="text-xl hover:scale-115" />
                        }
                        size="small"
                        variation="accept"
                        disabled={isUpdatingRequest}
                        onClick={() =>
                          update({ requestId: request.id, answer: "ACCEPT" })
                        }
                      />
                      <Button
                        icon={
                          <IoMdClose
                            className="text-xl hover:text-red-500"
                            onClick={() =>
                              update({
                                requestId: request.id,
                                answer: "DECLINE",
                              })
                            }
                          />
                        }
                        size="small"
                        disabled={isUpdatingRequest}
                      />
                    </div>
                  </div>
                </div>
              ))}

          {isSentRequestsLoading
            ? Array.from({ length: 1 }).map((_, i) => (
                <FriendSkeleton key={i} variation="sent" />
              ))
            : sentFriendRequests?.map((request) => (
                <div key={request.id}>
                  <h3 className="px-4 py-6 text-xl font-semibold">
                    Sent Requests
                  </h3>
                  <div className="flex items-center gap-2 border-b-1 border-[var(--color-grey-300)]">
                    <div className="px-4 grow grid grid-cols-[auto_1fr_auto] text-left gap-2 items-center ">
                      <div className="px-3">
                        <ProfileImage
                          imgSrc={request?.sender?.avatar}
                          size="xs"
                        />
                      </div>
                      <div className="py-4">
                        <span>{request?.receiver?.username}</span>
                      </div>
                      <div
                        className={`px-3 p-2 rounded-md text-sm ${
                          statusClass[request.status]
                        }`}
                      >
                        {request.status}
                      </div>
                    </div>

                    {request.status !== "ACCEPTED" && (
                      <div className="flex items-center gap-1 px-4 ">
                        <Button
                          icon={
                            <IoMdClose
                              className="text-xl hover:text-red-500"
                              onClick={() => deleteRequest(request.id)}
                            />
                          }
                          size="small"
                          disabled={isDeletingRequest}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

          {isFriendsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <FriendSkeleton key={i} variation="friends" />
              ))
            : friends?.map((friend) => (
                <div key={friend.id}>
                  <Menus>
                    <Menus.Menu>
                      <Menus.Toggle id={friend?.id}>
                        <div
                          key={friend.id}
                          className={`grid grid-cols-[auto_1fr] text-left gap-2 items-center`}
                        >
                          <div className="px-3 py-4 ">
                            <ProfileImage imgSrc={friend?.avatar} size="xs" />
                          </div>
                          <div className="py-4">
                            <span>{friend?.username}</span>
                          </div>
                        </div>
                      </Menus.Toggle>

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
                    </Menus.Menu>
                  </Menus>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;
