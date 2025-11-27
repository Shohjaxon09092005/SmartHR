import axiosInstance from "@/lib/axios";
import type { JobMatch } from "@/services/jobs";

export interface CandidateMatch {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  professionalTitle?: string;
  location?: string;
  experienceYears?: string;
  skills: string[];
  experience?: string;
  education?: string;
  resumeContent?: string;
  matchScore: number;
  matchReason: string;
  applicationStatus?: string | null;
  hasApplied: boolean;
}

export const matchingService = {
  findJobs: async (): Promise<JobMatch[]> => {
    const response = await axiosInstance.post<JobMatch[]>("/matching/find-jobs");
    return response.data;
  },

  findCandidates: async (vacancyId: string): Promise<CandidateMatch[]> => {
    const response = await axiosInstance.post<CandidateMatch[]>("/matching/find-candidates", {
      vacancyId,
    });
    return response.data;
  },
};

