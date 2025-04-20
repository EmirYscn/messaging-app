import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateUserDTO } from "../types/types";
import { updateUser } from "../services/apiUser";
import { useUser } from "./useUser";

export function useUpdateUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate: update, isPending: isLoading } = useMutation({
    mutationFn: async (body: UpdateUserDTO) => {
      if (!user) return;
      return await updateUser(user?.id, body);
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

      toast.success("Profile updated successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return { update, isLoading };
}
