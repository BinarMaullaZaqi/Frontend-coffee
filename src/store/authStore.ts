import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, AuthUser } from "../types";

const MOCK_USERS: Record<string, { password: string; nama: string }> = {
  "2200123456": { password: "kopi123", nama: "Budi Santoso" },
  "2200123457": { password: "barista99", nama: "Siti Rahayu" },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (nim, password) => {
        const found = MOCK_USERS[nim];
        if (found && found.password === password) {
          const user: AuthUser = { nim, nama: found.nama, role: "admin" };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "coffee-auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);