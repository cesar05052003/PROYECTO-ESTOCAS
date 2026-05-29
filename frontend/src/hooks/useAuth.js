import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, setAuth, logout: storeLogout } = useAuthStore();

  const logout = () => {
    storeLogout();
    navigate("/login");
  };

  return { user, token, setAuth, logout, isAuthenticated: !!token };
};
