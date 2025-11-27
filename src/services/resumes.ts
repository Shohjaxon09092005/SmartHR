import axiosInstance from "@/lib/axios";

export interface Resume {
  id: string;
  userId: string;
  content: string;
  skills: string[];
  experience?: string;
  education?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeData {
  content: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

export const resumeService = {
  get: async () => {
    const response = await axiosInstance.get<Resume>("/resumes");
    return response.data;
  },

  createOrUpdate: async (data: CreateResumeData) => {
    const response = await axiosInstance.post<Resume>("/resumes", data);
    return response.data;
  },

  update: async (data: Partial<CreateResumeData>) => {
    const response = await axiosInstance.put<Resume>("/resumes", data);
    return response.data;
  },
};

