import { useEffect } from "react";
import { socket } from "../../services/socket";
import { useChat } from "../useChat";

export function useSocketJoinRoom() {
  const { chat } = useChat();

  useEffect(() => {
    if (!chat?.id || !chat?.type) return;

    socket.emit("join_room", { chatId: chat.id, chatType: chat.type });

    return () => {
      socket.emit("leave_room", { chatId: chat.id, chatType: chat.type });
    };
  }, [chat?.id, chat?.type]);
}
