import { useTranslation } from "react-i18next";
import { useReceivedFriendRequests } from "../hooks/useReceivedFriendRequests";
import FriendSkeleton from "./FriendSkeleton";
import ProfileImage from "./ProfileImage";
import Button from "./Button";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { useUpdateFriendRequest } from "../hooks/useUpdateFriendRequest";

function ReceivedFriendRequests({
  searchbarValue,
}: {
  searchbarValue: string;
}) {
  const { t } = useTranslation("common");
  const { receivedFriendRequests, isLoading: isReceivedRequestsLoading } =
    useReceivedFriendRequests();
  const { update, isLoading: isUpdatingRequest } = useUpdateFriendRequest();

  let filteredReceivedRequests = receivedFriendRequests;

  if (searchbarValue) {
    filteredReceivedRequests = receivedFriendRequests?.filter((request) =>
      request?.sender?.username
        ?.toLowerCase()
        .includes(searchbarValue.toLowerCase())
    );
  }

  return isReceivedRequestsLoading ? (
    Array.from({ length: 1 }).map((_, i) => (
      <FriendSkeleton key={i} variation="received" />
    ))
  ) : filteredReceivedRequests && filteredReceivedRequests.length > 0 ? (
    <>
      <h3 className="px-4 py-3 text-xl font-semibold">
        {t("receivedRequests")}
      </h3>
      {filteredReceivedRequests.map((request) => (
        <div key={request.id}>
          <div className="flex gap-2">
            <div className="px-4 grow grid grid-cols-[auto_1fr] text-left gap-2 items-center ">
              <div className="px-3">
                <ProfileImage imgSrc={request?.sender.avatar} size="xs" />
              </div>
              <div className="py-4">
                <span>{request?.sender.username}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-4">
              <Button
                icon={<IoMdCheckmark className="text-xl hover:scale-115" />}
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
      <div className="border-b border-[var(--color-grey-300)] mx-4 my-2" />
    </>
  ) : null;
}

export default ReceivedFriendRequests;
