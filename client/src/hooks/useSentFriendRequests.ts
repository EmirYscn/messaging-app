import { useQuery } from "@tanstack/react-query";
import { getSentFriendRequests } from "../services/apiFriendRequest";

export const useSentFriendRequests = () => {
  const {
    isLoading,
    data: sentFriendRequests,
    error,
  } = useQuery({
    queryKey: ["friendRequests", "sent"],
    queryFn: () => getSentFriendRequests(),
  });

  return { isLoading, sentFriendRequests, error };
};
