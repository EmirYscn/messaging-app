import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import {
  AccountStatus,
  checkAccountStatus as checkAccountStatusApi,
} from "../services/apiAuth";
import { useUser } from "./useUser";

export function useCheckAccountStatus() {
  const [searchParams] = useSearchParams();
  const encodedData = searchParams.get("data");
  const navigate = useNavigate();
  const { user } = useUser();

  const { data, error, isLoading } = useQuery<AccountStatus, Error>({
    queryKey: ["accountStatus", encodedData],
    queryFn: async () => {
      if (!encodedData) throw new Error("No encoded data");
      let decodedData;
      try {
        decodedData = JSON.parse(atob(encodedData));
      } catch {
        throw new Error("Invalid encoded data");
      }
      return checkAccountStatusApi(decodedData);
    },
    enabled: !!encodedData,
    retry: false,
  });

  useEffect(() => {
    if (!encodedData) {
      navigate("/login", { replace: true });
    }
    if (error?.message === "Invalid encoded data") {
      navigate("/login", { replace: true });
    }
    // handle redirect if already linked and user matches
    if (
      data?.status === "linked" &&
      user &&
      user.id === data.accounts?.internalUser?.id
    ) {
      navigate("/", { replace: true });
    }
  }, [encodedData, error, data, user, navigate]);

  return {
    status: data?.status ?? (isLoading ? "loading" : undefined),
    accounts: data?.accounts ?? null,
    error: error?.message ?? "",
    isLoading,
    encodedData,
  };
}
