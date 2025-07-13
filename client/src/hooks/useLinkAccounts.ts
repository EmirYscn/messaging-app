import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { linkAccounts as linkAccountsApi } from "../services/apiAuth";
import { User } from "../types/types";
import { USER_QUERY_KEY } from "./useLogin";

export function useLinkAccounts() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: linkAccounts,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({
      externalUser,
      internalUser,
    }: {
      externalUser: Partial<User>;
      internalUser: Partial<User>;
    }) => linkAccountsApi(externalUser, internalUser),
    onSuccess: (user) => {
      queryClient.setQueryData([USER_QUERY_KEY], user);
      toast.success("Accounts linked successfully");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { linkAccounts, isPending, error };
}
