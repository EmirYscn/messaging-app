import { useParams } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "../services/apiChat";
import { Message } from "../types/types";
import { formatDate } from "../utils/formatDate";

type MessagePage = {
  messages: Message[];
  count: number;
  nextCursor: string | null;
};

type DateMessage = {
  id: string;
  type: "SYSTEM";
  content: string;
};

export const useChatMessages = () => {
  const { chatId } = useParams();

  const {
    data,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<MessagePage, Error>({
    queryKey: ["messages", chatId],
    queryFn: ({ pageParam = null }) =>
      getMessages(chatId!, pageParam as string),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!chatId,
  });

  const flatMessages = data?.pages
    ? data.pages
        .slice()
        .reverse() // reverse pages array to prepend new pages at the start
        .flatMap((page) => page.messages)
    : [];

  const messagesWithDateMarkers: (Message | DateMessage)[] = [];
  let lastDate = "";

  flatMessages.forEach((msg) => {
    const messageDate = formatDate(msg.createdAt.toString());
    if (messageDate !== lastDate) {
      // Insert a date marker message before the first message of a new date
      messagesWithDateMarkers.push({
        id: `date-${messageDate}`, // unique id for date marker
        type: "SYSTEM",
        content: messageDate,
      });
      lastDate = messageDate;
    }
    messagesWithDateMarkers.push(msg);
  });

  return {
    messages: messagesWithDateMarkers,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  };
};
