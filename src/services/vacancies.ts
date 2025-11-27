import axiosInstance from "@/lib/axios";
import type { Vacancy } from "@/types";

export interface CreateVacancyData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  category?: string;
  workType: string;
  remoteWork?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  experienceLevel?: string;
  experienceYears?: string;
  skills?: string[];
  applicationDeadline?: string;
  vacanciesCount?: number;
  urgent?: boolean;
}

export const vacancyService = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    category?: string;
    location?: string;
  }) => {
    const response = await axiosInstance.get<Vacancy[]>("/vacancies", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<Vacancy>(`/vacancies/${id}`);
    return response.data;
  },

  create: async (data: CreateVacancyData) => {
    const response = await axiosInstance.post<Vacancy>("/vacancies", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateVacancyData>) => {
    const response = await axiosInstance.put<Vacancy>(`/vacancies/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/vacancies/${id}`);
  },
};

