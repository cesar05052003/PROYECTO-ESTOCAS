import useAuthStore from "../store/authStore";

export const useRole = () => {
  const user = useAuthStore((state) => state.user);
  const rol = user?.rol || null;

  return {
    isAdmin: () => rol === "ADMIN",
    isLider: () => rol === "LIDER_PESV",
    isGerente: () => rol === "GERENTE",
    isConductor: () => rol === "CONDUCTOR",
    canEdit: () => rol === "ADMIN" || rol === "LIDER_PESV",
    canDelete: () => rol === "ADMIN" || rol === "LIDER_PESV",
    rol,
  };
};
