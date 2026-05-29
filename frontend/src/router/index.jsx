import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Layout from "../components/layout/Layout";

export const PrivateRoute = () => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Layout><Outlet /></Layout>;
};
