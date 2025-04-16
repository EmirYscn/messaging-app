import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../services/apiChat";

export const useChatMessages = () => {
  const { chatId } = useParams();

  const {
    isLoading,
    data: { messages, count } = { messages: [], count: 0 },
    error,
  } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId!),
  });

  return { isLoading, messages, count, error };
};
