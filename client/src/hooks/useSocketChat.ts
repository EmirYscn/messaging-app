import { useEffect } from "react";
import { socket } from "../services/socket";
import { useQueryClient } from "@tanstack/react-query";

export function useSocketChat() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("chat_created", () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "private"] });
    });

    return () => {
      socket.off("chat_created");
    };
  }, [queryClient]);
}
