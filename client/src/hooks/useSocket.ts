import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./useUser";

export function useSocket(): Socket | null {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user || socketRef.current || isConnected) return;

    const socket = io("http://localhost:3000", {
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
      console.log("✅ Connected to socket:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, isConnected]);

  return socketRef.current;
}
