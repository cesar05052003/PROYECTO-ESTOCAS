import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("pesv_user") || "null"),
  token: localStorage.getItem("pesv_token") || null,

  setAuth: (user, token) => {
    localStorage.setItem("pesv_user", JSON.stringify(user));
    localStorage.setItem("pesv_token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("pesv_user");
    localStorage.removeItem("pesv_token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
