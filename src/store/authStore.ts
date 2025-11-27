import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import type { AuthState, RegisterData, User } from "@/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await axiosInstance.post("/auth/login", {
            email,
            password,
          });
          
          const { token, user } = response.data;
          
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error: unknown) {
          console.error("Login error:", error);
          if ((error as any)?.isNetworkError) {
            throw new Error((error as any).networkErrorMessage || "Backend server is not running. Please start the server.");
          }
          const axiosError = error as any;
          throw new Error(axiosError.response?.data?.error || axiosError.message || "Login failed");
        }
      },

      register: async (data: RegisterData) => {
        try {
          const response = await axiosInstance.post("/auth/register", {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: data.role,
          });
          
          const { token, user } = response.data;
          
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error: unknown) {
          console.error("Register error:", error);
          if ((error as any)?.isNetworkError) {
            throw new Error((error as any).networkErrorMessage || "Backend server is not running. Please start the server.");
          }
          const axiosError = error as any;
          throw new Error(axiosError.response?.data?.error || axiosError.message || "Registration failed");
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
