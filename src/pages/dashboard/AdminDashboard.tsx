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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Yangi mock ma'lumotlar
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

const mockUsers = [
  { 
    id: "1", 
    name: "Alisher Karimov", 
    email: "alisher@example.com", 
    phone: "+998901234567",
    region: "Toshkent",
    role: "jobseeker", 
    status: "active",
    registrationDate: "2024-01-15",
    lastActive: "2024-03-20"
  },
  { 
    id: "2", 
    name: "Nodira Yusupova", 
    email: "nodira@example.com", 
    phone: "+998901234568",
    region: "Samarqand",
    role: "employer", 
    status: "active",
    registrationDate: "2024-02-10",
    lastActive: "2024-03-19"
  },
  { 
    id: "3", 
    name: "Jahongir Mahmudov", 
    email: "jahongir@example.com", 
    phone: "+998901234569",
    region: "Buxoro",
    role: "jobseeker", 
    status: "pending",
    registrationDate: "2024-03-01",
    lastActive: "2024-03-18"
  },
  { 
    id: "4", 
    name: "Dilnoza Rashidova", 
    email: "dilnoza@example.com", 
    phone: "+998901234570",
    region: "Andijon",
    role: "employer", 
    status: "active",
    registrationDate: "2024-01-25",
    lastActive: "2024-03-20"
  },
];

const mockVacancies = [
  { 
    id: "1", 
    title: "Frontend Developer", 
    company: "Tech Solutions", 
    applicants: 15, 
    status: "active",
    region: "Toshkent",
    salary: "2000-2500$",
    postedDate: "2024-03-15",
    category: "Texnologiya"
  },
  { 
    id: "2", 
    title: "Backend Developer", 
    company: "Digital Agency", 
    applicants: 8, 
    status: "active",
    region: "Toshkent",
    salary: "1800-2200$",
    postedDate: "2024-03-10",
    category: "Texnologiya"
  },
  { 
    id: "3", 
    title: "UI/UX Designer", 
    company: "Creative Studio", 
    applicants: 12, 
    status: "pending",
    region: "Samarqand",
    salary: "1500-1800$",
    postedDate: "2024-03-18",
    category: "Dizayn"
  },
  { 
    id: "4", 
    title: "Project Manager", 
    company: "Consulting Group", 
    applicants: 6, 
    status: "active",
    region: "Buxoro",
    salary: "2200-2800$",
    postedDate: "2024-03-12",
    category: "Menejment"
  },
];

export default function AdminDashboard() {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Jami foydalanuvchilar"
            value="1,234"
            change="+12% oxirgi oyda"
            icon={Users}
            trend="up"
          />
          <StatsCard
            title="Ish beruvchilar"
            value="156"
            change="+8% oxirgi oyda"
            icon={Building2}
            trend="up"
          />
          <StatsCard
            title="Aktiv vakansiyalar"
            value="342"
            change="+15% oxirgi oyda"
            icon={Briefcase}
            trend="up"
          />
          <StatsCard
            title="AI Match Rate"
            value="89%"
            change="+5% o'tgan oyga nisbatan"
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
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {user.region}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={user.status === "active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {user.registrationDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="ghost" title="Ko'rish">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Tasdiqlash">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Rad etish">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
                {mockVacancies.map((vacancy) => (
                  <TableRow key={vacancy.id}>
                    <TableCell className="font-medium">{vacancy.title}</TableCell>
                    <TableCell>{vacancy.company}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {vacancy.region}
                      </div>
                    </TableCell>
                    <TableCell>{vacancy.salary}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {vacancy.applicants} ta
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vacancy.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={vacancy.status === "active" ? "default" : "secondary"}
                        className={vacancy.status === "active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {vacancy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
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