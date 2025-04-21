import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUser } from "./useUser";
import { updateUserAvatar } from "../services/apiUser";

export function useAvatarUpload() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate: updateAvatar, isPending: isLoading } = useMutation({
    mutationFn: async (body: FormData) => {
      if (!user) return;
      return await updateUserAvatar(body, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["profile"],
        exact: false,
      });

      toast.success("Profile image updated successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return { updateAvatar, isLoading };
}
