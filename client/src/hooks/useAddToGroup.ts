import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useChat } from "./useChat";
import { addUsersToGroup } from "../services/apiChat";

export function useAddToGroup() {
  const queryClient = useQueryClient();

  const { chat } = useChat();

  const { mutate: addToGroup, isPending: isLoading } = useMutation({
    mutationFn: async (userIds: string[]) => {
      if (!chat) return;
      return await addUsersToGroup(chat.id, userIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat", chat?.id],
        exact: false,
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return { addToGroup, isLoading };
}
