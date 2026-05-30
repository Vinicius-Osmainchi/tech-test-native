import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../../../data/services/authStorage";

export function AuthGuard() {
  const isAuthenticated = !!getAuthToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
