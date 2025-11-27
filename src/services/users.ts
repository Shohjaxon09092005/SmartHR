import axiosInstance from "@/lib/axios";
import type { User } from "@/types";

export const userService = {
  getAll: async () => {
    const response = await axiosInstance.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<User>) => {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/users/${id}`);
  },
};

