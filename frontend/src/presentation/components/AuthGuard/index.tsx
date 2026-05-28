import { Navigate, Outlet } from "react-router-dom";

export function AuthGuard() {
  const isAuthenticated = !!localStorage.getItem("@TechTest:token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
