export type UserRole = "admin" | "employer" | "jobseeker";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  employerId: string;
  status: "active" | "closed" | "pending";
  matchScore?: number;
  createdAt: string;
}

export interface Application {
  id: string;
  vacancyId: string;
  jobSeekerId: string;
  status: "pending" | "approved" | "rejected";
  matchScore: number;
  appliedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  content: string;
  skills: string[];
  experience: string;
  education: string;
  createdAt: string;
}

export interface StatsCard {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
}
