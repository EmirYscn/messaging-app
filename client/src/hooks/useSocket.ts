import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./useUser";

const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:3000";

export function useSocket(): Socket | null {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user || socketRef.current || isConnected) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("jwt"),
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, isConnected]);

  return socketRef.current;
}
