import ProfileImage from "./ProfileImage";
import Searchbar from "./Searchbar";

import { useFriends } from "../hooks/useFriends";
import Menus from "./Menus";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { IoPersonAdd } from "react-icons/io5";
import { useCreateChat } from "../hooks/useCreateChat";
import { useReceivedFriendRequests } from "../hooks/useReceivedFriendRequests";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import Button from "./Button";
import { useSentFriendRequests } from "../hooks/useSentFriendRequests";

function Friends() {
  const { friends } = useFriends();
  const { createChat } = useCreateChat();

  const { receivedFriendRequests } = useReceivedFriendRequests();
  const { sentFriendRequests } = useSentFriendRequests();

  const statusClass = {
    PENDING: "bg-[var(--color-brand-100)] text-gray-200",
    ACCEPTED: "bg-[var(--color-green-700)] text-[var(--color-grey-50)]",
    DECLINED: "bg-[var(--color-red-700)] text-gray-200",
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-4 flex-1">
        <h1 className="px-4 py-6 text-4xl font-semibold">Friends</h1>
        <div className="px-4 ">
          <Searchbar placeholder="Search in the friends" />
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto">
          <h3 className="px-4 py-3 text-xl font-semibold">Received Requests</h3>
          {receivedFriendRequests?.map((request) => (
            <div className="flex gap-2 border-b-1 border-[var(--color-grey-300)]">
              <div className="px-4 grow grid grid-cols-[auto_1fr] text-left gap-2 items-center ">
                <div className="px-3">
                  <ProfileImage imgSrc={request?.sender.avatar} size="xs" />
                </div>
                <div className=" py-4">
                  <span>{request?.sender.username}</span>
                </div>
              </div>
              <div className="px-4 flex gap-1 items-center ">
                <Button
                  icon={<IoMdCheckmark className="text-xl hover:scale-115" />}
                  size="small"
                  variation="accept"
                  //   disabled={isUpdating}
                  //   onClick={handleUpdate}
                />
                <Button
                  icon={
                    <IoMdClose
                      className="text-xl hover:text-red-500"
                      //   onClick={() => handleReset("username")}
                    />
                  }
                  size="small"
                  //   disabled={isUpdating}
                />
              </div>
            </div>
          ))}

          <h3 className="px-4 py-6 text-xl font-semibold">Sent Requests</h3>
          {sentFriendRequests?.map((request) => (
            <div className="flex items-center gap-2 border-b-1 border-[var(--color-grey-300)]">
              <div className="px-4 grow grid grid-cols-[auto_1fr_auto] text-left gap-2 items-center ">
                <div className="px-3">
                  <ProfileImage imgSrc={request?.sender?.avatar} size="xs" />
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
                <div className="px-4 flex gap-1 items-center ">
                  <Button
                    icon={
                      <IoMdClose
                        className="text-xl hover:text-red-500"
                        //   onClick={() => handleReset("username")}
                      />
                    }
                    size="small"
                    //   disabled={isUpdating}
                  />
                </div>
              )}
            </div>
          ))}

          {friends?.map((friend) => (
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
                  <Menus.Button icon={<IoPersonAdd />}>Add Friend</Menus.Button>
                  <Menus.Button
                    icon={<BiSolidMessageSquareAdd />}
                    onClick={() => createChat(friend.id)}
                  >
                    Send Message
                  </Menus.Button>
                </Menus.List>
              </Menus.Menu>
            </Menus>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;
