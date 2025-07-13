import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { login as loginApi, LoginCredentials } from "../services/apiAuth";

export const USER_QUERY_KEY = "user";

export function useLogin(
  redirectUrl?: string | null,
  redirectToCheckAccountStatus = false
) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData([USER_QUERY_KEY], user);
      const navigateUrl =
        redirectToCheckAccountStatus && redirectUrl ? `/${redirectUrl}` : "/";
      navigate(navigateUrl, { replace: true });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { login, isPending, error };
}
