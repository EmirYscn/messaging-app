import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { getReceivedFriendRequests } from "../services/apiUser";

export const useReceivedFriendRequests = () => {
  const { user } = useUser();

  const {
    isLoading,
    data: receivedFriendRequests,
    error,
  } = useQuery({
    queryKey: ["friendRequests", "received"],
    queryFn: () => {
      if (!user) return;
      return getReceivedFriendRequests(user?.id);
    },
  });

  return { isLoading, receivedFriendRequests, error };
};
