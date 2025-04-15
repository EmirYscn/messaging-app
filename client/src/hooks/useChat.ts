import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getChat } from "../services/apiMessages";

export const useChat = () => {
  const { chatId } = useParams();
  //   const [searchParams] = useSearchParams();

  //   const search = searchParams.get("s") || "";
  //   const tag = searchParams.get("tag") || "all";
  //   const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

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
