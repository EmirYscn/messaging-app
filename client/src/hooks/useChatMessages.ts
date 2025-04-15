import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../services/apiMessages";

export const useChatMessages = () => {
  const { chatId } = useParams();
  //   const [searchParams] = useSearchParams();

  //   const search = searchParams.get("s") || "";
  //   const tag = searchParams.get("tag") || "all";
  //   const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

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
