import { useEffect } from "react";
import { socket } from "../../services/socket";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Message, MESSAGE_TYPE } from "../../types/types";

type SystemMessageType = {
  id: string;
  chatId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  type: MESSAGE_TYPE;
};

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
      queryClient.setQueryData<
        InfiniteData<{
          messages: Message[];
          count: number;
          nextCursor: string | null;
        }>
      >(["messages", data.chatId], (oldData) => {
        if (!oldData) {
          return {
            pages: [
              {
                messages: [],
                count: 1,
                nextCursor: null,
              },
            ],
            pageParams: [null],
          };
        }

        const systemMessage: SystemMessageType = {
          id: `system-${Date.now()}`,
          chatId: data.chatId,
          content: `${data.leavingUser.username} has left the group.`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          senderId: data.leavingUser.id,
          type: MESSAGE_TYPE.SYSTEM,
        };

        const updatedPages = [...oldData.pages];
        updatedPages[0] = {
          ...updatedPages[0],
          messages: [...updatedPages[0].messages, systemMessage],
          count: updatedPages[0].count + 1,
        };

        return {
          ...oldData,
          pages: updatedPages,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["chat", data.chatId] });
    });

    socket.on("users_joined_group", (data) => {
      queryClient.setQueryData<
        InfiniteData<{
          messages: Message[];
          count: number;
          nextCursor: string | null;
        }>
      >(["messages", data.chatId], (oldData) => {
        if (!oldData) {
          return {
            pages: [
              {
                messages: [],
                count: 1,
                nextCursor: null,
              },
            ],
            pageParams: [null],
          };
        }

        const usernames = data.joinedUsers
          .map((user) => user.username)
          .join(", ");
        const systemMessage: SystemMessageType = {
          id: `system-${Date.now()}`,
          chatId: data.chatId,
          content: `${usernames} joined the group.`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          senderId: data.joinedUsers[0].id,
          type: MESSAGE_TYPE.SYSTEM,
        };

        const updatedPages = [...oldData.pages];
        updatedPages[0] = {
          ...updatedPages[0],
          messages: [...updatedPages[0].messages, systemMessage],
          count: updatedPages[0].count + 1,
        };

        return {
          ...oldData,
          pages: updatedPages,
        };
      });

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
