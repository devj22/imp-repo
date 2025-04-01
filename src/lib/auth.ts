import { apiRequest } from "@/lib/queryClient";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: { id: number; username: string } | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        try {
          const response = await apiRequest("POST", "/api/auth/login", { username, password });
          const data = await response.json();
          
          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
          });
          
          return true;
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },
      
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

// Type-safe auth header function
export const getAuthHeader = (): Record<string, string> => {
  const { token } = useAuthStore.getState();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
