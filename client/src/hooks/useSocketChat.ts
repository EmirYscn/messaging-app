import { useEffect } from "react";
import { socket } from "../services/socket";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "../types/types";

export function useSocketChat() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("chat_created", () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "private"] });
    });
    socket.on("chat_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "private"] });
    });
    socket.on("user_left_group", (data) => {
      queryClient.setQueryData(
        ["messages", data.chatId],
        (oldData: { messages: Message[]; count: number }) => {
          const safeMessages = Array.isArray(oldData?.messages)
            ? oldData.messages
            : [];

          return {
            ...oldData,
            messages: [
              ...safeMessages,
              {
                id: `system-${Date.now()}`,
                chatId: data.chatId,
                content: `${data.leavingUser.username} has left the group.`,
                createdAt: new Date().toISOString(),
                type: "SYSTEM",
              },
            ],
            count: (oldData?.count ?? safeMessages.length) + 1,
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["chat", data.chatId] });
    });

    socket.on("users_joined_group", (data) => {
      console.log(data);
      queryClient.setQueryData(
        ["messages", data.chatId],
        (oldData: { messages: Message[]; count: number }) => {
          const safeMessages = Array.isArray(oldData?.messages)
            ? oldData.messages
            : [];

          const usernames = data.joinedUsers.map((user) => user.username);
          const joinedUsers = usernames.join(", ");

          return {
            ...oldData,
            messages: [
              ...safeMessages,
              {
                id: `system-${Date.now()}`,
                chatId: data.chatId,
                content: `${joinedUsers} has joined the group.`,
                createdAt: new Date().toISOString(),
                type: "SYSTEM",
              },
            ],
            count: (oldData?.count ?? safeMessages.length) + 1,
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["chat", data.chatId] });
    });

    return () => {
      socket.off("chat_created");
      socket.off("chat_updated");
      socket.off("user_left_group");
      socket.off("users_joined_group");
    };
  }, [queryClient]);
}
