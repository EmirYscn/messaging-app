import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteMessages as deleteMessagesApi } from "../services/apiMessages";
import { useChat } from "./useChat";

export function useDeleteMessages() {
  const { chat } = useChat();
  const queryClient = useQueryClient();

  const { mutate: deleteMessages, isPending: isLoading } = useMutation({
    mutationFn: (messageIds: string[]) => deleteMessagesApi(messageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", chat?.id],
      });

      queryClient.invalidateQueries({ queryKey: ["chats", "private"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return { deleteMessages, isLoading };
}
