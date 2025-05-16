import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Message as MessageType } from "../types/types";
import { formatDateToHour } from "../utils/formatDateToHour";
import ProfileImage from "./ProfileImage";
import { IoIosArrowDown, IoMdDownload } from "react-icons/io";
import Menus from "./Menus";
import { IoCopyOutline } from "react-icons/io5";
import { useCreateChat } from "../hooks/useCreateChat";
import { useChat } from "../hooks/useChat";
import { useTranslation } from "react-i18next";
import { BsFillTrashFill } from "react-icons/bs";
import { useDeleteMessages } from "../hooks/useDeleteMessages";
import { MediaWithSkeleton } from "./MediaWithSkeleton";

type MessageProps = {
  message: MessageType;
  setSelectedMessages: React.Dispatch<React.SetStateAction<string[]>>;
  isSelecting: boolean;
};

function Message({ message, setSelectedMessages, isSelecting }: MessageProps) {
  const { t } = useTranslation("menus");
  const { t: chatsT } = useTranslation("chats");

  const { chat } = useChat();
  const { user } = useUser();

  const { createChat, isLoading: isCreating } = useCreateChat();
  const { deleteMessages, isLoading: isDeleting } = useDeleteMessages();

  const [isHovering, setIsHovering] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const { senderId, sender, content, createdAt } = message;

  const isCurrentUser = senderId === user?.id;

  function handleSelectMessage() {
    if (isSelecting) {
      if (isSelected) {
        setSelectedMessages((prev) => prev.filter((id) => id !== message.id));
        setIsSelected(false);
      } else {
        setSelectedMessages((prev) => [...prev, message.id]);
        setIsSelected(true);
      }
    }
  }

  return (
    <div
      className={`flex gap-2 items-start w-full ${
        isCurrentUser ? "self-end flex-row-reverse" : ""
      }`}
    >
      {isSelecting && isCurrentUser && (
        <div className="flex items-center space-x-2">
          <label htmlFor={message.id} className="relative cursor-pointer">
            <input
              type="checkbox"
              id={message.id}
              className="hidden peer"
              onChange={handleSelectMessage}
            />
            <span className="block w-5 h-5 transition-colors duration-150 bg-gray-700 rounded-md shadow-inner bg-gradient-to-b from-gray-600 to-gray-500 peer-checked:from-blue-600 peer-checked:to-blue-700">
              <svg
                className="absolute top-[3px] left-[3px] w-3 h-3 stroke-white stroke-2 transition-all duration-150 peer-checked:stroke-dashoffset-0"
                viewBox="0 0 12 11"
              >
                <polyline
                  points="1 6.29411765 4.5 10 11 1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="17"
                  strokeDashoffset="17"
                  className="peer-checked:stroke-dashoffset-0"
                />
              </svg>
            </span>
          </label>
        </div>
      )}
      <div className={`flex-shrink-0 ${isCurrentUser ? "ml-2" : "mr-2"}`}>
        <ProfileImage imgSrc={sender?.avatar} size="xs" />
      </div>

      <div
        className="relative"
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        {/* Message Arrow */}
        <div
          className={`absolute top-2 w-0 h-0 border-t-[10px] border-b-[10px] border-t-transparent border-b-transparent ${
            isCurrentUser
              ? "-right-2 border-l-[10px] border-l-[var(--color-blue-500)]"
              : "-left-2 border-r-[10px] border-r-[var(--color-blue-100)]"
          }`}
        />

        {/* Message Content */}
        <div
          className={`group flex flex-col gap-1 rounded-2xl px-4 py-2 w-max break-words max-w-[12rem] md:max-w-[24rem] ${
            isCurrentUser
              ? "bg-[var(--color-blue-500)] text-white"
              : "bg-[var(--color-blue-100)] text-[var(--color-grey-800)]"
          }`}
        >
          {!isCurrentUser && (
            <span className="text-sm font-bold">{sender?.username}</span>
          )}

          {message.media && message.media.length > 0 && (
            <div className="flex flex-col gap-2">
              {message.media.map((media) => (
                <MediaWithSkeleton key={media.id} src={media.url} />
              ))}
            </div>
          )}
          {message.content && <span>{content}</span>}

          {isHovering && (
            <Menus>
              <Menus.Menu className="absolute top-0 right-[-10px]">
                <Menus.Toggle
                  id={message.id}
                  icon={<IoIosArrowDown />}
                  className="transition-transform duration-300 group-hover:-translate-x-2 hover:bg-transparent"
                />
                <Menus.List id={message.id}>
                  {chat?.type !== "PRIVATE" && !isCurrentUser && (
                    <Menus.Button
                      icon={<IoCopyOutline />}
                      onClick={() => {
                        createChat(message.senderId);
                      }}
                      disabled={isCreating}
                    >
                      <span className="text-sm">{t("sendMessage")}</span>
                    </Menus.Button>
                  )}
                  {message.type === "TEXT" && (
                    <Menus.Button
                      icon={<IoCopyOutline />}
                      onClick={() => {
                        navigator.clipboard.writeText(content);
                      }}
                    >
                      <span className="text-sm">{t("copy")}</span>
                    </Menus.Button>
                  )}
                  {message.type === "IMAGE" && (
                    <Menus.Button
                      icon={<IoMdDownload />}
                      onClick={() => {
                        // Implement download functionality
                      }}
                    >
                      <span className="text-sm">{chatsT("download")}</span>
                    </Menus.Button>
                  )}
                  {isCurrentUser && (
                    <Menus.Button
                      icon={<BsFillTrashFill />}
                      onClick={() => {
                        deleteMessages([message.id]);
                      }}
                      disabled={isDeleting}
                    >
                      <span className="text-sm">{chatsT("deleteMessage")}</span>
                    </Menus.Button>
                  )}
                </Menus.List>
              </Menus.Menu>
            </Menus>
          )}

          <span
            className={`text-[10px] opacity-70 text-right ${
              isCurrentUser ? "" : "text-[var(--color-grey-700)]"
            }`}
          >
            {formatDateToHour(createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Message;
