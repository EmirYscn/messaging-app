import { useEffect } from "react";
import { socket } from "../services/socket";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Message } from "../types/types";

export function useReceiveMessage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      queryClient.setQueryData<
        InfiniteData<{
          messages: Message[];
          count: number;
          nextCursor: string | null;
        }>
      >(["messages", message.chatId], (oldData) => {
        if (!oldData) {
          return {
            pages: [{ messages: [message], count: 1, nextCursor: null }],
            pageParams: [null],
          };
        }

        const newPages = [...oldData.pages];
        const firstPageIndex = 0;

        newPages[firstPageIndex] = {
          ...newPages[firstPageIndex],
          messages: [...newPages[firstPageIndex].messages, message],
          count: newPages[firstPageIndex].count + 1,
        };

        return {
          ...oldData,
          pages: newPages,
        };
      });
    };

    const handleMessagesUpdate = (data: { chatId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", data.chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats", "private"] });
    };

    socket.on("messages_updated", handleMessagesUpdate);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_updated", handleMessagesUpdate);
    };
  }, [queryClient]);
}
