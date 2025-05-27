import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/apiUser";

export const useUserProfile = (userId: string) => {
  const {
    isLoading,
    data: profile,
    error,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required to fetch profile");
      }
      return getProfile(userId);
    },
  });

  return { isLoading, profile, error };
};
