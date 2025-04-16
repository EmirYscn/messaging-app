import { useQuery } from "@tanstack/react-query";

import { useUser } from "./useUser";
import { getChats } from "../services/apiUser";

export const useChats = () => {
  const { user } = useUser();

  const {
    isLoading,
    data: { chats, count } = { chats: [], count: 0 },
    error,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => getChats(user!.id),
    enabled: !!user?.id,
  });

  return { isLoading, chats, count, error };
};
