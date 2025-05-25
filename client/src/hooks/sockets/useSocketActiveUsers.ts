import { useEffect, useState } from "react";
import { socket } from "../../services/socket";
import { User } from "../../types/types";

export function useSocketActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const handleAddToActiveUsers = (data: User) => {
      setActiveUsers((prev) => {
        const userExists = prev.some((user) => user.id === data.id);
        if (!userExists) {
          return [...prev, data];
        }
        return prev;
      });
    };

    const handleRemoveFromActiveUsers = (data: User) => {
      setActiveUsers((prev) => prev.filter((user) => user.id !== data.id));
    };

    const handleInitialActiveUsers = (users: User[]) => {
      const uniqueUsers = Array.from(
        new Map(users.map((u) => [u.id, u])).values()
      );

      setActiveUsers(uniqueUsers);
    };

    const handleRoomJoined = () => {
      setHasJoined(true);
    };

    socket.on("active_users_list", handleInitialActiveUsers);
    socket.on("add_to_active_users", handleAddToActiveUsers);
    socket.on("remove_from_active_users", handleRemoveFromActiveUsers);
    socket.on("room_joined", handleRoomJoined);

    return () => {
      socket.off("active_users_list", handleInitialActiveUsers);
      socket.off("add_to_active_users", handleAddToActiveUsers);
      socket.off("remove_from_active_users", handleRemoveFromActiveUsers);
      socket.off("room_joined", handleRoomJoined);
    };
  }, []);

  return { activeUsers, hasJoined };
}
