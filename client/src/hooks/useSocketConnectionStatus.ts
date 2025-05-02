import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket"; // adjust path as needed
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

type KnownDisconnectReason =
  | "io server disconnect"
  | "io client disconnect"
  | "transport close"
  | "ping timeout"
  | "transport error";

const errorMessages: Record<KnownDisconnectReason, string> = {
  "io server disconnect": t("io server disconnect"),
  "io client disconnect": t("io client disconnect"),
  "transport close": t("transport close"),
  "ping timeout": t("ping timeout"),
  "transport error": t("transport error"),
};

export function useSocketConnectionStatus() {
  const { t } = useTranslation("infoMessages");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [errorMessage, setErrorMessage] = useState("");
  const reconnectToastId = useRef<string | null>(null);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setErrorMessage(""); // clear any previous error
      //  If a reconnecting toast exists, dismiss it
      if (reconnectToastId.current) {
        toast.dismiss(reconnectToastId.current);
        reconnectToastId.current = null;
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
