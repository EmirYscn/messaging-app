import { useEffect } from "react";
import { socket } from "../services/socket";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "../types/types";

export function useReceiveMessage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      queryClient.invalidateQueries({ queryKey: ["messages", message.chatId] });
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
