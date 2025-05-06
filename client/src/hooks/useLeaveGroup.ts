import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { leaveGroupChat } from "../services/apiChat";

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: leaveGroup, isPending } = useMutation({
    mutationFn: leaveGroupChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "private"] });
      navigate("/", { replace: true });
    },
  });
  return { leaveGroup, isPending };
}
