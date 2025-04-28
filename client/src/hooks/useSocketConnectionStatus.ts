import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket"; // adjust path as needed
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

type KnownDisconnectReason =
  | "io server disconnect"
  | "io client disconnect"
  | "transport close"
  | "ping timeout"
  | "transport error";

const errorMessages: Record<KnownDisconnectReason, string> = {
  "io server disconnect":
    "You have been disconnected by the server. Please try again.",
  "io client disconnect": "You have disconnected. Please refresh or reconnect.",
  "transport close": "Connection was lost. Trying to reconnect...",
  "ping timeout":
    "Connection timed out. Please check your internet connection.",
  "transport error": "A network error occurred. Please try again.",
};

export function useSocketConnectionStatus() {
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
      const message = errorMessages[knownReason] ?? "Disconnected";

      setErrorMessage(socket.active ? "Reconnecting..." : message);

      if (socket.active) {
        if (!reconnectToastId.current) {
          reconnectToastId.current = toast.loading("Reconnecting...");
        }
      } else {
        toast.error(message);
      }

      console.error("Socket disconnected:", reason);
    };

    const handleConnectError = (err: Error) => {
      console.error("Socket connection error:", err);

      setErrorMessage(
        socket.active ? "Reconnecting..." : `Connection failed: ${err.message}`
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
  }, []);

  return { isConnected, errorMessage };
}
