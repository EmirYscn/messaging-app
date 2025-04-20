import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { getProfile } from "../services/apiUser";

export const useProfile = () => {
  const { user } = useUser();

  const {
    isLoading,
    data: profile,
    error,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => {
      if (!user) return;
      return getProfile(user?.id);
    },
  });

  return { isLoading, profile, error };
};
