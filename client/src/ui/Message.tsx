import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Message as MessageType } from "../types/types";
import { formatDateToHour } from "../utils/formatDateToHour";
import ProfileImage from "./ProfileImage";
import { IoIosArrowDown } from "react-icons/io";
import Menus from "./Menus";
import { IoCopyOutline } from "react-icons/io5";
import { useCreateChat } from "../hooks/useCreateChat";
import { useChat } from "../hooks/useChat";

function Message({ message }: { message: MessageType }) {
  const { createChat } = useCreateChat();
  const { chat } = useChat();
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useUser();
  const { senderId, sender, content, createdAt } = message;

  const isCurrentUser = senderId === user?.id;

  return (
    <div
      className={`flex gap-2 items-start ${
        isCurrentUser ? "self-end flex-row-reverse" : ""
      }`}
    >
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
        {/* {isHovering && (
          <div
            className={`absolute top-2 left-2 w-full h-full bg-black/50 rounded-2xl flex items-center justify-center text-white text-sm font-bold transition-opacity duration-300`}
            onClick={() => {
              navigator.clipboard.writeText(content);
            }}
          ></div>
        )} */}

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
          className={`group gap-1 rounded-2xl px-4 py-2 w-max break-words max-w-[12rem] md:max-w-[24rem] grid grid-cols-2 grid-rows-2 items-center  ${
            isCurrentUser
              ? "bg-[var(--color-blue-500)] text-white"
              : "bg-[var(--color-blue-100)] text-[var(--color-grey-800)]"
          }`}
        >
          {!isCurrentUser && (
            <span className="col-span-2 text-sm font-bold">
              {sender?.username}
            </span>
          )}

          <span className={`${isCurrentUser ? "col-span-1" : ""}`}>
            {content}
          </span>

          {isHovering && (
            <Menus>
              <Menus.Menu className="absolute top-0 right-[-10px]">
                <Menus.Toggle
                  id={message.id}
                  icon={<IoIosArrowDown />}
                  className="transition-transform duration-300 group-hover:-translate-x-2 hover:bg-transparent"
                />
                <Menus.List id={message.id}>
                  {chat?.type !== "PRIVATE" && (
                    <Menus.Button
                      icon={<IoCopyOutline />}
                      onClick={() => {
                        createChat(message.senderId);
                      }}
                    >
                      <span className="text-sm">Send message</span>
                    </Menus.Button>
                  )}
                  <Menus.Button
                    icon={<IoCopyOutline />}
                    onClick={() => {
                      navigator.clipboard.writeText(content);
                    }}
                  >
                    <span className="text-sm">Copy</span>
                  </Menus.Button>
                </Menus.List>
              </Menus.Menu>
            </Menus>
          )}

          <span
            className={`text-[10px] opacity-70 text-right self-end ${
              isCurrentUser ? "col-span-2" : "text-[var(--color-grey-700)]"
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
