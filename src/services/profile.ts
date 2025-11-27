import axiosInstance from "@/lib/axios";

export interface ProfileData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    birthDate: string;
    bio: string;
    avatar: string;
  };
  professional: {
    title: string;
    experience: string;
    currentCompany: string;
    skills: Array<{ name: string; level: number }>;
    resume: string;
    resumeScore: number;
  };
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    period: string;
    description: string;
    startDate?: string;
    endDate?: string;
  }>;
  experience: Array<{
    id: string;
    position: string;
    company: string;
    period: string;
    description: string;
    startDate?: string;
    endDate?: string;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    description: string;
    link: string;
    technologies: string[];
  }>;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
  settings: {
    emailNotifications: boolean;
    jobAlerts: boolean;
    twoFactorAuth: boolean;
    privacy: string;
  };
  stats: {
    profileViews: number;
    applications: number;
    interviews: number;
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  birthDate?: string;
  professionalTitle?: string;
  experienceYears?: string;
  currentCompany?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  settings?: {
    emailNotifications?: boolean;
    jobAlerts?: boolean;
    twoFactorAuth?: boolean;
    privacy?: string;
  };
}

export interface EducationData {
  degree: string;
  institution: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ExperienceData {
  position: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface PortfolioData {
  title: string;
  description?: string;
  link?: string;
  technologies?: string[];
}

export const profileService = {
  get: async (): Promise<ProfileData> => {
    const response = await axiosInstance.get<ProfileData>("/profile");
    return response.data;
  },

  update: async (data: UpdateProfileData): Promise<void> => {
    await axiosInstance.put("/profile", data);
  },

  addEducation: async (data: EducationData): Promise<{ id: string } & EducationData> => {
    const response = await axiosInstance.post<{ id: string } & EducationData>(
      "/profile/education",
      data
    );
    return response.data;
  },

  deleteEducation: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/profile/education/${id}`);
  },

  addExperience: async (data: ExperienceData): Promise<{ id: string } & ExperienceData> => {
    const response = await axiosInstance.post<{ id: string } & ExperienceData>(
      "/profile/experience",
      data
    );
    return response.data;
  },

  deleteExperience: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/profile/experience/${id}`);
  },

  addPortfolio: async (data: PortfolioData): Promise<{ id: string } & PortfolioData> => {
    const response = await axiosInstance.post<{ id: string } & PortfolioData>(
      "/profile/portfolio",
      data
    );
    return response.data;
  },

  deletePortfolio: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/profile/portfolio/${id}`);
  },
};

