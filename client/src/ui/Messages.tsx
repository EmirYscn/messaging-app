import { useEffect, useLayoutEffect, useRef } from "react";

import Message from "./Message";

import { useChatMessages } from "../hooks/useChatMessages";
// import { useChat } from "../hooks/useChat";
import { useReceiveMessage } from "../hooks/sockets/useSocketMessage";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import {
  // CHAT_TYPE,
  Message as MessageType,
  MESSAGE_TYPE,
} from "../types/types";
import SpinnerMini from "./SpinnerMini";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatDate } from "../utils/formatDate";

type MessagesProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  isSelecting: boolean;
  setSelectedMessages: React.Dispatch<React.SetStateAction<string[]>>;
  onReply: (msg: MessageType) => void;
};

function Messages({
  containerRef,
  bottomRef,
  isSelecting,
  setSelectedMessages,
  onReply,
}: MessagesProps) {
  const { t } = useTranslation("chats");
  // const { chat } = useChat();
  const today = formatDate(new Date().toISOString());
  const {
    messages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useChatMessages();

  const { ref: topRef, inView } = useInView();

  useReceiveMessage();

  const hasMounted = useRef(false);
  const initialLoadDone = useRef(false);
  const userScrolledUp = useRef(false);

  // For storing scroll position before fetching more
  const previousScrollHeight = useRef(0);
  const previousScrollTop = useRef(0);

  // Detect scroll to track if user scrolled near top manually
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const onScroll = () => {
      // Distance from bottom
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceFromBottom < 100) {
        userScrolledUp.current = false; // user near bottom
      } else {
        userScrolledUp.current = true; // user scrolled up
      }
    };

    container.addEventListener("scroll", onScroll);

    // Initialize userScrolledUp on mount:
    onScroll();

    return () => container.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  // Control fetch on inView (load older messages)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return; // skip first render
    }
    if (
      inView &&
      hasNextPage &&
      initialLoadDone.current &&
      userScrolledUp.current
    ) {
      // Save scroll position before fetching
      const container = containerRef?.current;
      if (container) {
        previousScrollHeight.current = container.scrollHeight;
        previousScrollTop.current = container.scrollTop;
      }
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, containerRef]);

  // Mark initial load done
  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && messages.length > 0) {
      initialLoadDone.current = true;
    }
  }, [isLoading, isFetchingNextPage, messages]);

  // After loading more messages, adjust scroll position to prevent jump
  useLayoutEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    if (isFetchingNextPage) return; // wait until fetching is done

    if (
      previousScrollHeight.current &&
      previousScrollTop.current !== undefined
    ) {
      const newScrollHeight = container.scrollHeight;
      const heightDiff = newScrollHeight - previousScrollHeight.current;
      // Adjust scrollTop by the height difference so user stays in place
      container.scrollTop = previousScrollTop.current + heightDiff;

      // Reset stored values
      previousScrollHeight.current = 0;
      previousScrollTop.current = 0;
    }
  }, [messages, isFetchingNextPage, containerRef]);

  useEffect(() => {
    if (
      messages.length > 0 &&
      !isLoading &&
      !isFetchingNextPage &&
      bottomRef.current &&
      containerRef?.current
    ) {
      if (!userScrolledUp.current) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "end",
          });
        }, 50);
      }
    }
  }, [messages, isLoading, isFetchingNextPage, containerRef, bottomRef]);

  return (
    <div className={`flex flex-col gap-4 text-gray-900 p-4`}>
      <div className="flex items-center justify-center" ref={topRef}>
        <button
          onClick={() => fetchNextPage()}
          className=" opacity-50 px-4 py-2 rounded-3xl text-[var(--color-grey-900)] text-sm font-semibold"
        >
          {isFetchingNextPage
            ? t("loading")
            : hasNextPage
            ? t("loadMore")
            : t("noMoreMessagesFromThisPoint")}
        </button>
      </div>

      {hasNextPage && <div>{isFetchingNextPage && <SpinnerMini />}</div>}
      {/* {chat?.type === CHAT_TYPE.PUBLIC && (
        <div className="flex items-center justify-center ">
          <span className="opacity-50 px-4 py-2 rounded-3xl text-[var(--color-grey-900)] text-sm font-semibold">
            {messages.length > 0 ? t("messages24h") : t("noMessages24h")}
          </span>
        </div>
      )} */}

      {isLoading ? (
        <div className="flex flex-col gap-4 px-4 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <MessageSkeleton key={i} isCurrentUser={i % 2 === 1} />
          ))}
        </div>
      ) : (
        messages?.map((message) =>
          message.type === MESSAGE_TYPE.SYSTEM ? (
            <div
              key={message.id}
              className="text-center text-xs text-[var(--color-grey-500)] my-2"
            >
              {message.content}
            </div>
          ) : message.type === MESSAGE_TYPE.SYSTEM_DATE ? (
            <div
              key={message.id}
              className="text-center text-xs text-[var(--color-grey-500)] my-2"
            >
              {message.content === today ? t("today") : message.content}
            </div>
          ) : (
            <Message
              key={message.id}
              message={message as MessageType}
              isSelecting={isSelecting}
              setSelectedMessages={setSelectedMessages}
              onReply={onReply}
            />
          )
        )
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default Messages;
