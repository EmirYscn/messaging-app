import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../services/apiFriends";

export const useFriends = () => {
  const {
    isLoading,
    data: friends,
    error,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(),
  });

  return { isLoading, friends, error };
};
