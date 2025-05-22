import { useParams } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "../services/apiChat";
import { Message } from "../types/types";

// export const useChatMessages = () => {
//   const { chatId } = useParams();

//   const {
//     isLoading,
//     data: { messages, count } = { messages: [], count: 0 },
//     error,
//   } = useQuery({
//     queryKey: ["messages", chatId],
//     queryFn: () => getMessages(chatId!),
//   });

//   return { isLoading, messages, count, error };
// };

type MessagePage = {
  messages: Message[];
  count: number;
  nextCursor: string | null;
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

  const messages = data?.pages
    ? data.pages
        .slice()
        .reverse() // reverse pages array to prepend new pages at the start
        .flatMap((page) => page.messages)
    : [];

  return {
    messages,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  };
};
