import { useQuery } from "@tanstack/react-query";
import { getChats } from "../services/apiChat";

export const useChats = () => {
  const {
    isLoading,
    data: { chats, count } = { chats: [], count: 0 },
    error,
  } = useQuery({
    queryKey: ["chats", "private"],
    queryFn: () => getChats(),
  });

  return { isLoading, chats, count, error };
};
