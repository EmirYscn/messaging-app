import { useEffect } from "react";
import { socket } from "../services/socket";
import { useQueryClient } from "@tanstack/react-query";

export function useReceiveMessage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };

    const handleMessagesUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
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
