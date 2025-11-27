import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, CheckCircle, Clock, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockVacancies = [
  { id: "1", title: "Frontend Developer", applicants: 15, status: "active", date: "2025-11-20" },
  { id: "2", title: "Backend Developer", applicants: 8, status: "active", date: "2025-11-18" },
  { id: "3", title: "UI/UX Designer", applicants: 12, status: "pending", date: "2025-11-15" },
  { id: "4", title: "Project Manager", applicants: 6, status: "active", date: "2025-11-10" },
];

const mockApplicants = [
  { id: "1", name: "Alisher Karimov", position: "Frontend Developer", matchScore: 92, status: "pending" },
  { id: "2", name: "Nodira Yusupova", position: "UI/UX Designer", matchScore: 88, status: "pending" },
  { id: "3", name: "Jahongir Mahmudov", position: "Backend Developer", matchScore: 85, status: "approved" },
  { id: "4", name: "Dilnoza Rashidova", position: "Frontend Developer", matchScore: 79, status: "pending" },
];

export default function EmployerDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ish beruvchi paneli</h1>
            <p className="text-muted-foreground">Vakansiyalar va nomzodlar boshqaruvi</p>
          </div>
          <Button onClick={() => navigate("/dashboard/create-vacancy")} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Yangi vakansiya
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Faol vakansiyalar"
            value="12"
            change="+3 yangi"
            icon={Briefcase}
            trend="up"
          />
          <StatsCard
            title="Jami nomzodlar"
            value="156"
            change="+24 oxirgi hafta"
            icon={Users}
            trend="up"
          />
          <StatsCard
            title="Ko'rib chiqilmoqda"
            value="34"
            change="15 ta yangi"
            icon={Clock}
          />
          <StatsCard
            title="Tasdiqlangan"
            value="48"
            change="+8 bu oy"
            icon={CheckCircle}
            trend="up"
          />
        </div>

        {/* Vacancies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mening vakansiyalarim</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vakansiya</TableHead>
                  <TableHead>Nomzodlar soni</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead className="text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVacancies.map((vacancy) => (
                  <TableRow key={vacancy.id}>
                    <TableCell className="font-medium">{vacancy.title}</TableCell>
                    <TableCell>{vacancy.applicants} ta</TableCell>
                    <TableCell>
                      <Badge
                        variant={vacancy.status === "active" ? "default" : "secondary"}
                      >
                        {vacancy.status === "active" ? "Faol" : "Kutilmoqda"}
                      </Badge>
                    </TableCell>
                    <TableCell>{vacancy.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          Tahrirlash
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Applicants with AI Match Score */}
        <Card>
          <CardHeader>
            <CardTitle>Oxirgi nomzodlar (AI Match Score)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomzod</TableHead>
                  <TableHead>Vakansiya</TableHead>
                  <TableHead>AI Match Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="font-medium">{applicant.name}</TableCell>
                    <TableCell>{applicant.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-24 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-ai-gradient"
                            style={{ width: `${applicant.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{applicant.matchScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          applicant.status === "approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {applicant.status === "approved" ? "Tasdiqlangan" : "Kutilmoqda"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {applicant.status === "pending" && (
                          <Button size="sm">Tasdiqlash</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
