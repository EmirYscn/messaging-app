import { useEffect } from "react";
import { Message as MessageType } from "../types/types"; // adjust path if needed
import { socket } from "../services/socket";

export function useReceiveMessage(
  setLocalMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) {
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: MessageType) => {
      setLocalMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [setLocalMessages]);
}
