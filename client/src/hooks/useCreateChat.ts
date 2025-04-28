import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUser } from "./useUser";
import { createChat as createChatApi } from "../services/apiChat";
import { useNavigate } from "react-router";
import { Chat as ChatType } from "../types/types";

export function useCreateChat() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createChat, isPending: isLoading } = useMutation({
    mutationFn: async (oppositeUserId: string) => {
      const existingChats = queryClient.getQueryData<{
        chats: ChatType[];
        count: number;
      }>(["chats", "private"]);

      const existingChat = existingChats?.chats?.find((chat) =>
        chat?.users?.some((p) => p.id === oppositeUserId)
      );
      if (existingChat) {
        return existingChat.id;
      }
      if (!user) return;
      return await createChatApi(oppositeUserId);
    },
    onSuccess: (chatId) => {
      queryClient.invalidateQueries({
        queryKey: ["chats", "private"],
        exact: false,
      });
      navigate(`/chat/${chatId}`);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return { createChat, isLoading };
}
