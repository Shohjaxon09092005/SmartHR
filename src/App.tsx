import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

// Landing page
import LandingPage from "./pages/LandingPage";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard pages
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import EmployerDashboard from "./pages/dashboard/employer/EmployerDashboard";
import CreateVacancy from "./pages/dashboard/employer/CreateVacancy";
import JobSeekerDashboard from "./pages/dashboard/jobseeker/JobSeekerDashboard";
import ResumeGenerator from "./pages/dashboard/jobseeker/ResumeGenerator";
import CVAnalyzer from "./pages/dashboard/jobseeker/CVAnalyzer";
import JobMatches from "./pages/dashboard/jobseeker/JobMatches";
import Applications from "./pages/dashboard/jobseeker/Applications";
import Profile from "./pages/dashboard/jobseeker/Profile";
import VacanciesList from "./pages/dashboard/employer/VacanciesList";
import EditVacancy from "./pages/dashboard/employer/EditVacancy";
import Applicants from "./pages/dashboard/employer/Applicants";
import UsersPage from "./pages/dashboard/UsersPage";
import VacanciesPage from "./pages/dashboard/VacanciesPage";
import InterviewSimulator from "./pages/dashboard/jobseeker/InterviewSimulator";

const queryClient = new QueryClient();

const App = () => {
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Landing page */}
            <Route path="/landing-page" element={<LandingPage />} />

            {/* Redirect root based on auth status */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/landing-page" replace />
                )
              }
            />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === "admin" ? (
                    <AdminDashboard />
                  ) : user?.role === "employer" ? (
                    <EmployerDashboard />
                  ) : (
                    <JobSeekerDashboard />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            
            <Route
              path="/dashboard/employers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UsersPage/>
                </ProtectedRoute>
              }
            />

            {/* Employer Routes */}
            <Route
              path="/dashboard/create-vacancy"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <CreateVacancy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vacancies"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  {user?.role === "admin" ? (
                    <VacanciesPage />
                  ) : (
                    <VacanciesList />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/edit-vacancy/:id"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <EditVacancy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applicants"
              element={
                <ProtectedRoute allowedRoles={["employer"]}>
                  <Applicants />
                </ProtectedRoute>
              }
            />

            {/* Job Seeker Routes */}
            <Route
              path="/dashboard/resume-generator"
              element={
                <ProtectedRoute allowedRoles={["jobseeker"]}>
                  <ResumeGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/cv-analyzer"
              element={
                <ProtectedRoute allowedRoles={["jobseeker"]}>
                  <CVAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/job-matches"
              element={
                <ProtectedRoute allowedRoles={["jobseeker"]}>
                  <JobMatches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applications"
              element={
                <ProtectedRoute allowedRoles={["jobseeker"]}>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={["jobseeker"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/interview-simulator"
              element={
                <ProtectedRoute allowedRoles={["jobseeker"]}>
                  <InterviewSimulator />
                </ProtectedRoute>
              }
            />

            {/* Common Routes */}
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  {user?.role === "admin" ? (
                    <AdminDashboard />
                  ) : user?.role === "employer" ? (
                    <EmployerDashboard />
                  ) : (
                    <JobSeekerDashboard />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
