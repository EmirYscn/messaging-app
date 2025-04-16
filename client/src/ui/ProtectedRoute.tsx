import { Navigate, useLocation } from "react-router";

import Spinner from "../ui/Spinner";
import { useUser } from "../hooks/useUser";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  const hasToken = !!localStorage.getItem("jwt");

  if (hasToken && isLoading) {
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>;
  }

  if (!hasToken || (!isLoading && !isAuthenticated)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
