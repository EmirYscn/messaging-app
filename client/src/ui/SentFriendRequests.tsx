import { useTranslation } from "react-i18next";
import { useSentFriendRequests } from "../hooks/useSentFriendRequests";
import ProfileImage from "./ProfileImage";
import Button from "./Button";
import { IoMdClose } from "react-icons/io";
import { useDeleteFriendRequest } from "../hooks/useDeleteFriendRequest";
import FriendSkeleton from "./skeletons/FriendSkeleton";

function SentFriendRequests({ searchbarValue }: { searchbarValue: string }) {
  const { t } = useTranslation("common");
  const { sentFriendRequests, isLoading: isSentRequestsLoading } =
    useSentFriendRequests();
  const { deleteRequest, isLoading: isDeletingRequest } =
    useDeleteFriendRequest();

  let filteredSentRequests = sentFriendRequests;
  if (searchbarValue) {
    filteredSentRequests = sentFriendRequests?.filter((request) =>
      request?.receiver?.username
        ?.toLowerCase()
        .includes(searchbarValue.toLowerCase())
    );
  }

  const statusClass = {
    PENDING: "bg-[var(--color-brand-100)] text-gray-200",
    ACCEPTED: "bg-[var(--color-green-700)] text-[var(--color-grey-50)]",
    DECLINED: "bg-[var(--color-red-700)] text-gray-200",
  };

  const statusText = {
    PENDING: t("pending"),
    ACCEPTED: t("accepted"),
    DECLINED: t("declined"),
  };

  return isSentRequestsLoading ? (
    Array.from({ length: 1 }).map((_, i) => (
      <FriendSkeleton key={i} variation="sent" />
    ))
  ) : filteredSentRequests && filteredSentRequests.length > 0 ? (
    <>
      <h3 className="px-4 py-6 text-xl font-semibold">{t("sentRequests")}</h3>
      {filteredSentRequests.map((request) => (
        <div key={request.id}>
          <div className="flex items-center gap-2 ">
            <div className="px-4 grow grid grid-cols-[auto_1fr_auto] text-left gap-2 items-center ">
              <div className="px-3">
                <ProfileImage imgSrc={request?.receiver?.avatar} size="xs" />
              </div>
              <div className="py-4">
                <span>{request?.receiver?.username}</span>
              </div>
              <div
                className={`px-3 p-2 rounded-md text-sm ${
                  statusClass[request.status]
                }`}
              >
                {statusText[request.status]}
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
      <div className="border-b border-[var(--color-grey-300)] mx-4 my-2" />
    </>
  ) : null;
}

export default SentFriendRequests;
