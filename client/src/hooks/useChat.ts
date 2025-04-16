import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getChat } from "../services/apiChat";

export const useChat = () => {
  const { chatId } = useParams();

  const {
    isLoading,
    data: chat,
    error,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChat(chatId!),
  });

  return { isLoading, chat, error };
};
