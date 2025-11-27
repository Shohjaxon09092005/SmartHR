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
          // Mock login - backend bo'lmaganda
          const mockUser: User = {
            id: "1",
            firstName: "Admin",
            lastName: "User",
            email: email,
            role: email.includes("admin") ? "admin" : email.includes("employer") ? "employer" : "jobseeker",
            createdAt: new Date().toISOString(),
          };
          
          const mockToken = "mock-jwt-token-" + Date.now();
          
          localStorage.setItem("token", mockToken);
          localStorage.setItem("user", JSON.stringify(mockUser));
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          // Mock registration
          const mockUser: User = {
            id: Date.now().toString(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            role: data.role,
            createdAt: new Date().toISOString(),
          };
          
          const mockToken = "mock-jwt-token-" + Date.now();
          
          localStorage.setItem("token", mockToken);
          localStorage.setItem("user", JSON.stringify(mockUser));
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Register error:", error);
          throw error;
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
