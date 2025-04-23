import { useEffect, useState } from "react";
import { socket } from "../services/socket"; // adjust path as needed

type DisconnectReason =
  | "io server disconnect"
  | "io client disconnect"
  | "transport close"
  | "ping timeout"
  | "transport error";

const errorMessages: Record<DisconnectReason, string> = {
  "io server disconnect": "Server disconnected you",
  "io client disconnect": "Client disconnected",
  "transport close": "Transport closed",
  "ping timeout": "Ping timeout",
  "transport error": "Transport error",
};

export function useSocketConnectionStatus() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setErrorMessage(""); // clear any previous error
    };

    const handleDisconnect = (reason) => {
      setIsConnected(false);
      //   setErrorMessage(errorMessages[reason] || "Disconnected");
      setErrorMessage(socket.active ? "Reconnecting..." : `Connection failed`);
      // Optionally, you can log the reason for disconnection
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
