import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Eye, 
  CheckCircle, 
  XCircle, 
  MapPin,
  Calendar,
  Phone,
  Download,
  Filter,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { userService } from "@/services/users";
import { vacancyService, type Vacancy } from "@/services/vacancies";
import { applicationService } from "@/services/applications";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types";

// Mock regional stats (can be enhanced later with real API)
const regionalStats = [
  { region: "Toshkent", jobSeekers: 450, employers: 45, vacancies: 120, matchRate: 78 },
  { region: "Samarqand", jobSeekers: 320, employers: 28, vacancies: 85, matchRate: 65 },
  { region: "Buxoro", jobSeekers: 280, employers: 22, vacancies: 67, matchRate: 72 },
  { region: "Andijon", jobSeekers: 380, employers: 35, vacancies: 95, matchRate: 68 },
  { region: "Farg'ona", jobSeekers: 410, employers: 38, vacancies: 110, matchRate: 75 },
];

const skillGapData = [
  { skill: "Dasturlash", demand: 85, supply: 60, gap: 25 },
  { skill: "Digital Marketing", demand: 70, supply: 45, gap: 25 },
  { skill: "Moliya", demand: 65, supply: 55, gap: 10 },
  { skill: "Sotuv", demand: 80, supply: 70, gap: 10 },
  { skill: "Liderlik", demand: 75, supply: 50, gap: 25 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [usersData, vacanciesData] = await Promise.all([
        userService.getAll(),
        vacancyService.getAll({ status: "active" }),
      ]);
      
      setUsers(usersData);
      setVacancies(vacanciesData.slice(0, 4));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ma'lumotlarni yuklashda xatolik";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platformaning umumiy statistikasi va monitoringi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Jami foydalanuvchilar"
                value={users.length.toString()}
                change={`${users.filter(u => u.role === 'jobseeker').length} ish izlovchi`}
                icon={Users}
                trend="up"
              />
              <StatsCard
                title="Ish beruvchilar"
                value={users.filter(u => u.role === 'employer').length.toString()}
                change={`${users.filter(u => u.role === 'employer').length} ta kompaniya`}
                icon={Building2}
                trend="up"
              />
              <StatsCard
                title="Aktiv vakansiyalar"
                value={vacancies.length.toString()}
                change={`${vacancies.filter(v => v.status === 'active').length} ta faol`}
                icon={Briefcase}
                trend="up"
              />
              <StatsCard
                title="AI Match Rate"
                value="85%"
                change="Platforma koeffitsiyenti"
                icon={TrendingUp}
                trend="up"
              />
            </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Regional Statistics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Viloyatlar bo'yicha statistika</CardTitle>
              <Select defaultValue="jobseekers">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ko'rsatkich turi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jobseekers">Ish qidiruvchilar</SelectItem>
                  <SelectItem value="employers">Ish beruvchilar</SelectItem>
                  <SelectItem value="vacancies">Vakansiyalar</SelectItem>
                  <SelectItem value="matchrate">Match darajasi</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalStats.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{region.jobSeekers} ta</div>
                      <div className="text-sm text-muted-foreground">
                        {region.employers} ish beruvchi • {region.vacancies} vakansiya
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Skill-Gap Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>AI Skill-Gap Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGapData.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.skill}</span>
                      <span>Gap: {skill.gap}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                        style={{ width: `${skill.demand}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Talab: {skill.demand}%</span>
                      <span>Taklif: {skill.supply}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Foydalanuvchilar ro'yxati</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Qidirish..." className="pl-8 w-[200px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="pending">Kutilmoqda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foydalanuvchi</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Viloyat</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ro'yxatdan o'tgan</TableHead>
                  <TableHead className="text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Foydalanuvchilar topilmadi
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phone ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">-</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {user.role === 'jobseeker' ? 'Ish izlovchi' : user.role === 'employer' ? 'Ish beruvchi' : 'Admin'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            title="Ko'rish"
                            onClick={() => navigate(`/dashboard/users`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Vacancies Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vakansiyalar monitoringi</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Qidirish..." className="pl-8 w-[200px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="pending">Kutilmoqda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vakansiya</TableHead>
                  <TableHead>Kompaniya</TableHead>
                  <TableHead>Viloyat</TableHead>
                  <TableHead>Maosh</TableHead>
                  <TableHead>Nomzodlar</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacancies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Vakansiyalar topilmadi
                    </TableCell>
                  </TableRow>
                ) : (
                  vacancies.map((vacancy) => (
                    <TableRow key={vacancy.id}>
                      <TableCell className="font-medium">{vacancy.title}</TableCell>
                      <TableCell>{vacancy.company}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {vacancy.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vacancy.salaryMin && vacancy.salaryMax 
                          ? `$${vacancy.salaryMin}-$${vacancy.salaryMax}` 
                          : vacancy.salary || "Ko'rsatilmagan"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {(vacancy as any).applicationCount || 0} ta
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vacancy.category || "Noma'lum"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={vacancy.status === "active" ? "default" : "secondary"}
                          className={vacancy.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {vacancy.status === "active" ? "Faol" : vacancy.status === "closed" ? "Yopilgan" : "Kutilmoqda"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => navigate(`/dashboard/vacancies`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}