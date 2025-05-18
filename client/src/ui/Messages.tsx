import { useEffect, useRef } from "react";

import Message from "./Message";

import { useChatMessages } from "../hooks/useChatMessages";
import { useChat } from "../hooks/useChat";
import { useReceiveMessage } from "../hooks/useSocketMessage";
import MessageSkeleton from "./MessageSkeleton";
import { useTranslation } from "react-i18next";

type MessagesProps = {
  isSelecting: boolean;
  setSelectedMessages: React.Dispatch<React.SetStateAction<string[]>>;
};

function Messages({ isSelecting, setSelectedMessages }: MessagesProps) {
  const { t } = useTranslation("chats");
  const { chat } = useChat();
  // const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
  //   useChatMessages();
  const { messages, isLoading } = useChatMessages();

  // const messages = data?.pages.flatMap((page) => page.messages) || [];

  // const { ref: topRef, inView } = useInView();
  const bottomRef = useRef<HTMLDivElement>(null);
  // const hasMounted = useRef(false);

  useReceiveMessage();

  // useEffect(() => {
  //   if (!hasMounted.current) {
  //     hasMounted.current = true;
  //     return; // Don't fetch on initial mount
  //   }

  //   if (inView && hasNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (messages.length > 0 && !isLoading && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div
      className={`flex flex-col gap-4 bg-[var(--color-grey-50)] text-gray-900 p-4`}
    >
      {/* {hasNextPage && (
        <div ref={topRef}>
          {isFetchingNextPage && (
            <div className="flex flex-col gap-4 mb-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <MessageSkeleton key={i} isCurrentUser={i % 2 === 1} />
              ))}
            </div>
          )}
        </div>
      )} */}
      {chat?.type === "PUBLIC" && (
        <div className="flex items-center justify-center ">
          <span className="bg-[var(--color-grey-200)] opacity-50 px-4 py-2 rounded-3xl text-[var(--color-grey-900)] text-sm font-semibold">
            {messages.length > 0 ? t("messages24h") : t("noMessages24h")}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4 px-4 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <MessageSkeleton key={i} isCurrentUser={i % 2 === 1} />
          ))}
        </div>
      ) : (
        messages.map((message) =>
          message.type === "SYSTEM" ? (
            <div
              key={message.id}
              className="text-center text-xs text-[var(--color-grey-500)] my-2"
            >
              {message.content}
            </div>
          ) : (
            <Message
              key={message.id}
              message={message}
              isSelecting={isSelecting}
              setSelectedMessages={setSelectedMessages}
            />
          )
        )
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default Messages;
