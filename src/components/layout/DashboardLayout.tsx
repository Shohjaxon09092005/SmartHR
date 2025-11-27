import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
