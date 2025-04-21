import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { getFriends } from "../services/apiUser";

export const useFriends = () => {
  const { user } = useUser();

  const {
    isLoading,
    data: friends,
    error,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: () => {
      if (!user) return;
      return getFriends(user?.id);
    },
  });

  return { isLoading, friends, error };
};
