import { useQuery } from "@tanstack/react-query";
import { getSearchedUsers } from "../services/apiUser";

export const useSearchUsers = (username: string) => {
  const {
    isLoading,
    data: users,
    error,
  } = useQuery({
    queryKey: ["searchedUsers", username], // <-- include username here!
    queryFn: async () => {
      if (!username) return [];
      return await getSearchedUsers(username);
    },
    enabled: !!username, // <-- don't run query if username is empty
  });

  return { isLoading, users, error };
};
