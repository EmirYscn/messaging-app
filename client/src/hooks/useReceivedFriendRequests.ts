import { useQuery } from "@tanstack/react-query";
import { getReceivedFriendRequests } from "../services/apiFriendRequest";

export const useReceivedFriendRequests = () => {
  const {
    isLoading,
    data: receivedFriendRequests,
    error,
  } = useQuery({
    queryKey: ["friendRequests", "received"],
    queryFn: () => getReceivedFriendRequests(),
  });

  return { isLoading, receivedFriendRequests, error };
};
