import axiosInstance from "@/lib/axios";

export interface Application {
  id: string;
  vacancyId: string;
  jobSeekerId: string;
  status: "pending" | "review" | "interview" | "accepted" | "rejected";
  matchScore: number;
  notes?: string;
  appliedAt: string;
  updatedAt: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  employerName?: string;
  jobSeekerName?: string;
  jobSeekerEmail?: string;
}

export const applicationService = {
  getAll: async () => {
    const response = await axiosInstance.get<Application[]>("/applications");
    return response.data;
  },

  create: async (vacancyId: string) => {
    const response = await axiosInstance.post<Application>("/applications", { vacancyId });
    return response.data;
  },

  update: async (id: string, data: { status?: string; notes?: string }) => {
    const response = await axiosInstance.put<Application>(`/applications/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/applications/${id}`);
  },
};

