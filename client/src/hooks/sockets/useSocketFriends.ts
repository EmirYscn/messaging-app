import { useEffect } from "react";
import { socket } from "../../services/socket";
import { useQueryClient } from "@tanstack/react-query";

export function useSocketFriends() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("friend_requests_updated", () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["friends"],
        exact: false,
      });
    });
    socket.on("friends_updated", () => {
      queryClient.invalidateQueries({
        queryKey: ["friends"],
        exact: false,
      });
    });

    return () => {
      socket.off("friend_requests_updated");
      socket.off("friends_updated");
    };
  }, [queryClient]);
}
