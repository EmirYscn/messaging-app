import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "../ui/Spinner";
import { connectSocket } from "../services/socket";

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return; // Prevent running twice
    effectRan.current = true;

    const fetchUser = async () => {
      const encodedData = searchParams.get("data");
      const encodedRedirect = searchParams.get("redirect");
      if (encodedData) {
        try {
          const decodedData = JSON.parse(atob(encodedData));
          const { user, provider, accessToken, refreshToken } = decodedData;

          queryClient.setQueryData(["user"], user);
          // Store tokens in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          connectSocket();

          toast.success(
            `Successfully logged in ${provider ? `with ${provider}` : ""}`
          );
          // If a redirect URL is provided, navigate to it
          if (encodedRedirect) {
            const redirectUrl = decodeURIComponent(encodedRedirect);
            return navigate(redirectUrl, { replace: true });
          }

          setTimeout(() => {
            navigate("/", { replace: true });
          }, 300);
        } catch {
          toast.error("Authentication failed");
          navigate("/login", { replace: true });
        }
      }
    };

    fetchUser();
  }, [navigate, queryClient, searchParams]);

  return <Spinner />;
}

export default AuthSuccess;
