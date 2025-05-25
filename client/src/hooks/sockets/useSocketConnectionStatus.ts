import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { useTranslation } from "react-i18next";

import { socket } from "../../services/socket";
import { useChat } from "../useChat";

type KnownDisconnectReason =
  | "io server disconnect"
  | "io client disconnect"
  | "transport close"
  | "ping timeout"
  | "transport error";

export function useSocketConnectionStatus() {
  const { t } = useTranslation("infoMessages");
  const { chat } = useChat();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [errorMessage, setErrorMessage] = useState("");
  const reconnectToastId = useRef<string | null>(null);
  const latestChatRef = useRef(chat);

  // Update the ref on every chat change
  useEffect(() => {
    latestChatRef.current = chat;
  }, [chat]);

  useEffect(() => {
    const errorMessages: Record<KnownDisconnectReason, string> = {
      "io server disconnect": t("io server disconnect"),
      "io client disconnect": t("io client disconnect"),
      "transport close": t("transport close"),
      "ping timeout": t("ping timeout"),
      "transport error": t("transport error"),
    };

    const handleConnect = () => {
      setIsConnected(true);
      setErrorMessage(""); // clear any previous error
      //  If a reconnecting toast exists, dismiss it
      if (reconnectToastId.current) {
        toast.dismiss(reconnectToastId.current);
        reconnectToastId.current = null;
      }

      const currentChat = latestChatRef.current;
      if (currentChat?.id && currentChat?.type) {
        socket.emit("join_room", {
          chatId: currentChat.id,
          chatType: currentChat.type,
        });
      }
    };

    const handleDisconnect = (reason: Socket.DisconnectReason) => {
      setIsConnected(false);
      const knownReason = reason as KnownDisconnectReason;
      const message = errorMessages[knownReason] ?? t("disconnected");

      setErrorMessage(socket.active ? t("reconnecting") : message);

      if (socket.active) {
        if (!reconnectToastId.current) {
          reconnectToastId.current = toast.loading(`${t("reconnecting")}...`);
        }
      } else {
        toast.error(message);
      }

      console.error("Socket disconnected:", reason);
    };

    const handleConnectError = (err: Error) => {
      console.error("Socket connection error:", err);

      setErrorMessage(
        socket.active
          ? t("reconnecting")
          : `${t("connectionFailed")}: ${err.message}`
      );

      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [t]);

  return { isConnected, errorMessage };
}
