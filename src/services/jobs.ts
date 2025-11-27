import axiosInstance from "@/lib/axios";
import type { Vacancy } from "@/types";

export interface JobMatch extends Vacancy {
  matchScore: number;
  alreadyApplied?: boolean;
  isSaved?: boolean;
}

export const jobService = {
  getMatches: async () => {
    const response = await axiosInstance.get<JobMatch[]>("/jobs/matches");
    return response.data;
  },

  save: async (vacancyId: string) => {
    await axiosInstance.post(`/jobs/${vacancyId}/save`);
  },

  unsave: async (vacancyId: string) => {
    await axiosInstance.delete(`/jobs/${vacancyId}/save`);
  },

  getSaved: async () => {
    const response = await axiosInstance.get<Vacancy[]>("/jobs/saved");
    return response.data;
  },
};

