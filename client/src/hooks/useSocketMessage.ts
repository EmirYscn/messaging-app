import { useEffect } from "react";
import { socket } from "../services/socket";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Message } from "../types/types";

export function useReceiveMessage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;

    // const handleReceiveMessage = (message: Message) => {
    //   queryClient.setQueryData(
    //     ["messages", message.chatId],
    //     (oldData: { messages: Message[]; count: number }) => {
    //       if (!oldData) return { messages: [message] };
    //       return {
    //         messages: [...oldData.messages, message],
    //       };
    //     }
    //   );
    // };
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

        // Insert message into the **last page** (or whichever logic you want)
        const newPages = [...oldData.pages];
        const lastPageIndex = newPages.length - 1;

        newPages[lastPageIndex] = {
          ...newPages[lastPageIndex],
          messages: [...newPages[lastPageIndex].messages, message],
          count: newPages[lastPageIndex].count + 1,
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
