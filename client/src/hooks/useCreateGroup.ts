import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Chat, User } from "../types/types";

import toast from "react-hot-toast";
import { createGroupChat } from "../services/apiChat";
import { useNavigate } from "react-router";

type CreateGroupParams = {
  name: string;
  users: User[];
  imageFile: File | null;
};

export function useCreateGroup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: createGroup, isPending: isCreatingGroup } = useMutation({
    mutationFn: async ({ name, users, imageFile }: CreateGroupParams) => {
      const userIds = users.map((u) => u.id);
      return await createGroupChat({ name, userIds, imageFile });
    },
    onSuccess: (chat: Chat) => {
      queryClient.invalidateQueries({ queryKey: ["chats"], exact: false });
      navigate(`/chat/${chat.id}`);
      toast.success("Group created successfully");
    },
    onError: (err: Error) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  return { createGroup, isCreatingGroup };
}
