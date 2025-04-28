import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteFriendRequest } from "../services/apiFriendRequest";

export function useDeleteFriendRequest() {
  const queryClient = useQueryClient();

  const { mutate: deleteRequest, isPending: isLoading } = useMutation({
    mutationFn: async (requestId: string) => deleteFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["friendRequests"],
        exact: false,
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return { deleteRequest, isLoading };
}
