import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../services/apiAuth";
import { useEffect } from "react";
import { connectSocket } from "../services/socket";

const USER_QUERY_KEY = "user";

export const useUser = () => {
  const hasToken = Boolean(localStorage.getItem("accessToken"));
  const query = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: hasToken,
  });

  useEffect(() => {
    if (query.data) {
      connectSocket();
    }
  }, [query.data]);

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isAuthenticated: !!query.data,
  };
};
