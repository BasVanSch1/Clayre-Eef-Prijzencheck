import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "~/services/AuthProvider";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  });

  if (!isAuthenticated && isClient) {
    // Redirect to login page if not authenticated and on the client side
    return (
      <Navigate to="/login" state={{ redirect: location.pathname }} replace />
    );
  }

  if (!isAuthenticated && !isClient) {
    // If not authenticated and on the server side, return nothing
    return <div>Checking authentication...</div>;
  }

  return <>{children}</>;
}
