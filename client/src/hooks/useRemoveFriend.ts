import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeFriend as removeFriendApi } from "../services/apiFriends";

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  const { mutate: removeFriend, isPending: isLoading } = useMutation({
    mutationFn: async (friendId: string) => removeFriendApi(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends"],
        exact: false,
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return { removeFriend, isLoading };
}
