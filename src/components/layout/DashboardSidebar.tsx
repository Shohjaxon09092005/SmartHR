import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Building2,
  UserCircle,
  ClipboardList,
  BrainCircuit,
  TrendingUp,
  Search,
  UserSearch,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "employer", "jobseeker"],
  },
  {
    title: "Foydalanuvchilar",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin"],
  },
  
  {
    title: "Vakansiyalar",
    href: "/dashboard/vacancies",
    icon: Briefcase,
    roles: ["admin", "employer"],
  },
  {
    title: "Yangi vakansiya",
    href: "/dashboard/create-vacancy",
    icon: FileText,
    roles: ["employer"],
  },
  {
    title: "Nomzodlar",
    href: "/dashboard/applicants",
    icon: UserCircle,
    roles: ["employer"],
  },
  {
    title: "AI Candidate Finder",
    href: "/dashboard/candidate-finder",
    icon: UserSearch,
    roles: ["employer"],
  },
  {
    title: "AI Resume Generator",
    href: "/dashboard/resume-generator",
    icon: BrainCircuit,
    roles: ["jobseeker"],
  },
  {
    title: "CV Tahlil",
    href: "/dashboard/cv-analyzer",
    icon: TrendingUp,
    roles: ["jobseeker"],
  },
  {
    title: "Mos ishlar",
    href: "/dashboard/job-matches",
    icon: Briefcase,
    roles: ["jobseeker"],
  },
  {
    title: "AI Job Finder",
    href: "/dashboard/job-finder",
    icon: Search,
    roles: ["jobseeker"],
  },
  {
    title: "Arizalarim",
    href: "/dashboard/applications",
    icon: ClipboardList,
    roles: ["jobseeker"],
  },
  {
    title: "Profil",
    href: "/dashboard/profile",
    icon: Users,
    roles:["jobseeker"],
  },
 
];

export const DashboardSidebar = () => {
  const { user, logout } = useAuthStore();

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-xl font-bold text-sidebar-primary">SmartHR</h1>
      </div>

      {/* User Info */}
      {user && (
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
              <UserCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/50"
        >
          <LogOut className="h-5 w-5" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
};
