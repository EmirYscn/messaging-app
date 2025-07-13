import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createAndContinueWithThisAccount } from "../services/apiAuth";
import { User } from "../types/types";

export const USER_QUERY_KEY = "user";

export function useCreateAndContinueWithThisAccount() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createAndContinue, isPending } = useMutation({
    mutationFn: ({ user }: { user: Partial<User> }) =>
      createAndContinueWithThisAccount(user),
    onSuccess: (user) => {
      queryClient.setQueryData([USER_QUERY_KEY], user);
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { createAndContinue, isPending };
}
