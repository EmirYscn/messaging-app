import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "../ui/Spinner";
import { connectSocket } from "../services/socket";
// import { useUser } from "../hooks/useUser";
import { getCurrentUser } from "../services/apiAuth";

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
      try {
        const user = await getCurrentUser();

        queryClient.setQueryData(["user"], user);

        connectSocket();

        if (encodedData) {
          const decodedData = JSON.parse(atob(encodedData));
          const { provider } = decodedData;
          toast.success(
            `Successfully logged in ${provider ? `with ${provider}` : ""}`
          );
        }

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 300);
      } catch {
        toast.error("Authentication failed");
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [navigate, queryClient]);

  // useEffect(() => {
  //   if (effectRan.current) return; // Prevent running twice
  //   effectRan.current = true;

  //   const encodedData = searchParams.get("data");
  //   if (encodedData) {
  //     try {
  //       const decodedData = JSON.parse(atob(encodedData));
  //       const { token, user, provider } = decodedData;

  //       // Store token in localStorage
  //       localStorage.setItem("jwt", token);

  //       // connect socket
  //       connectSocket();

  //       // Update React Query cache with user data
  //       queryClient.setQueryData(["user"], user);

  //       // Show success message
  //       toast.success(`Successfully logged in with ${provider}`);
  //       // Redirect to dashboard
  //       // Navigate after success
  //       setTimeout(() => {
  //         navigate("/", { replace: true });
  //       }, 300);
  //     } catch {
  //       navigate("/login?error=invalid_data", { replace: true });
  //     }
  //   }
  // }, [searchParams, navigate, queryClient]);

  return <Spinner />;
}

export default AuthSuccess;
