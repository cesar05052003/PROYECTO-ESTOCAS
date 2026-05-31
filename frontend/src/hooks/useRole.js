import useAuthStore from "../store/authStore";

export const useRole = () => {
  const user = useAuthStore((state) => state.user);
  const rol = user?.rol || null;

  return {
    isAdmin: () => rol === "ADMINISTRADOR",
    isLider: () => rol === "LIDER",
    isGerente: () => rol === "GERENTE",
    isConductor: () => rol === "CONDUCTOR",
    canEdit: () => rol === "ADMINISTRADOR" || rol === "LIDER",
    canDelete: () => rol === "ADMINISTRADOR" || rol === "LIDER",
    canManageUsers: () => rol === "ADMINISTRADOR",
    rol,
  };
};
