import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  acceptFriendRequest,
  declineFriendRequest,
} from "../services/apiFriendRequest";

export function useUpdateFriendRequest() {
  const queryClient = useQueryClient();

  const { mutate: update, isPending: isLoading } = useMutation({
    mutationFn: async ({
      requestId,
      answer,
    }: {
      requestId: string;
      answer: "ACCEPT" | "DECLINE";
    }) => {
      if (answer === "ACCEPT") {
        return await acceptFriendRequest(requestId);
      }
      return await declineFriendRequest(requestId);
    },
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

  return { update, isLoading };
}
