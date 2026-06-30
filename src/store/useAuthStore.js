import { create } from "zustand";
import jwt_decode from "jwt-decode";

export const useAuthStore = create((set) => ({
  user: null,

  login: (token) => {
    localStorage.setItem("token", token);
    const decoded = jwt_decode(token);
    set({ user: decoded });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));