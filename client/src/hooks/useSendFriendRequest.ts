import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendFriendRequest } from "../services/apiFriendRequest";

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  const {
    mutate: sendRequest,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (receiverId: string) => sendFriendRequest(receiverId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests"],
        exact: false,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { sendRequest, isPending, error };
}
