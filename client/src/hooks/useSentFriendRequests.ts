import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { getSentFriendRequests } from "../services/apiUser";

export const useSentFriendRequests = () => {
  const { user } = useUser();

  const {
    isLoading,
    data: sentFriendRequests,
    error,
  } = useQuery({
    queryKey: ["friendRequests", "sent"],
    queryFn: () => {
      if (!user) return;
      return getSentFriendRequests(user?.id);
    },
  });

  return { isLoading, sentFriendRequests, error };
};
