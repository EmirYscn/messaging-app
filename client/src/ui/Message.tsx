import { useUser } from "../hooks/useUser";
import { Message as MessageType } from "../types/types";
import { formatDateToHour } from "../utils/formatDateToHour";
import ProfileImage from "./ProfileImage";

function Message({ message }: { message: MessageType }) {
  const { user } = useUser();

  const isCurrentUser = message.senderId === user?.id;

  return (
    <div
      className={`flex gap-2 items-start ${
        isCurrentUser ? "self-end flex-row-reverse" : ""
      }`}
    >
      <div className={`${isCurrentUser ? "ml-2" : "mr-2"} flex-shrink-0`}>
        <ProfileImage imgSrc={message.sender?.avatar} size="xs" />
      </div>
      <div className="relative">
        <div
          className={`
            absolute top-2 
            ${isCurrentUser ? "-right-2" : "-left-2"} 
            w-0 h-0 
            border-t-[10px] border-b-[10px] 
            ${
              isCurrentUser
                ? "border-l-[10px] border-l-[var(--color-blue-500)]"
                : "border-r-[10px] border-r-[var(--color-blue-100)]"
            } 
            border-t-transparent border-b-transparent
          `}
        />
        <div
          className={`relative flex flex-col gap-1 rounded-2xl px-4 py-2 w-max break-words max-w-[12rem] md:max-w-[24rem]
          ${
            isCurrentUser
              ? "bg-[var(--color-blue-500)] text-white border-t-0"
              : "bg-[var(--color-blue-100)] text-[var(--color-grey-800)]"
          }`}
        >
          {!isCurrentUser && (
            <span className="font-bold text-sm">
              {message?.sender?.username}
            </span>
          )}

          <span>{message?.content}</span>
          <span
            className={`text-[10px] opacity-70 text-[var(--color-grey-700)] text-right`}
          >
            {formatDateToHour(message?.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Message;
