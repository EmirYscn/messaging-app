import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { continueWithThisAccount as continueWithThisAccountApi } from "../services/apiAuth";
import { User } from "../types/types";

export const USER_QUERY_KEY = "user";

export function useContinueWithThisAccount() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: continueWithThisAccount, isPending } = useMutation({
    mutationFn: ({ user }: { user: Partial<User> }) =>
      continueWithThisAccountApi(user),
    onSuccess: (user) => {
      queryClient.setQueryData([USER_QUERY_KEY], user);
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { continueWithThisAccount, isPending };
}
