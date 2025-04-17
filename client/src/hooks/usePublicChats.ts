import { useQuery } from "@tanstack/react-query";
import { getPublicChats } from "../services/apiChat";

export const usePublicChats = () => {
  const {
    isLoading,
    data: publicChats,
    error,
  } = useQuery({
    queryKey: ["chats", "public"],
    queryFn: () => getPublicChats(),
  });

  return { isLoading, publicChats, error };
};
