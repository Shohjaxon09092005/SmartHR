import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Shield,
  UserCheck,
  UserX
} from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock ma'lumotlar
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
    lastActive: "2024-03-20",
    verified: true,
    applications: 12,
    profileCompletion: 85
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
    lastActive: "2024-03-19",
    verified: true,
    company: "Tech Solutions",
    vacancies: 8
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
    lastActive: "2024-03-18",
    verified: false,
    applications: 3,
    profileCompletion: 45
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
    lastActive: "2024-03-20",
    verified: true,
    company: "Digital Agency",
    vacancies: 15
  },
  { 
    id: "5", 
    name: "Sherzod Qodirov", 
    email: "sherzod@example.com", 
    phone: "+998901234571",
    region: "Farg'ona",
    role: "jobseeker", 
    status: "suspended",
    registrationDate: "2024-02-28",
    lastActive: "2024-03-10",
    verified: false,
    applications: 8,
    profileCompletion: 70
  },
];

const regions = [
  "Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", 
  "Namangan", "Qashqadaryo", "Surxandaryo", "Jizzax", "Sirdaryo",
  "Navoiy", "Xorazm", "Qoraqalpog'iston"
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  // Filtrlash funksiyasi
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRegion = regionFilter === "all" || user.region === regionFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesRegion;
  });

  // Statusni o'zgartirish
  const updateUserStatus = (userId: string, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // Foydalanuvchini o'chirish
  const deleteUser = (userId: string) => {
    if (confirm("Foydalanuvchini o'chirishni tasdiqlaysizmi?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Statistik ma'lumotlar
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    pending: users.filter(u => u.status === "pending").length,
    suspended: users.filter(u => u.status === "suspended").length,
    jobseekers: users.filter(u => u.role === "jobseeker").length,
    employers: users.filter(u => u.role === "employer").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Sarlavha va Harakatlar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Foydalanuvchilar Boshqaruvi</h1>
            <p className="text-muted-foreground">Barcha foydalanuvchilarni ko'rish va boshqarish</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Yangi Foydalanuvchi
            </Button>
          </div>
        </div>

        {/* Statistik Kartalar */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jami Foydalanuvchilar</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Faol Foydalanuvchilar</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ish Qidiruvchilar</p>
                  <p className="text-2xl font-bold">{stats.jobseekers}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ish Beruvchilar</p>
                  <p className="text-2xl font-bold">{stats.employers}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtrlar va Qidiruv */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Qidiruv */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Foydalanuvchi nomi, email yoki telefon bo'yicha qidirish..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtrlar */}
              <div className="flex gap-2 flex-wrap">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha Rollar</SelectItem>
                    <SelectItem value="jobseeker">Ish Qidiruvchi</SelectItem>
                    <SelectItem value="employer">Ish Beruvchi</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha Status</SelectItem>
                    <SelectItem value="active">Faol</SelectItem>
                    <SelectItem value="pending">Kutilmoqda</SelectItem>
                    <SelectItem value="suspended">Bloklangan</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Viloyat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha Viloyatlar</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtr
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Foydalanuvchilar Jadvali */}
        <Card>
          <CardHeader>
            <CardTitle>Foydalanuvchilar Ro'yxati</CardTitle>
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
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {user.name}
                            {user.verified && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Tasdiqlangan
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.role === 'jobseeker' 
                              ? `${user.applications} ariza • ${user.profileCompletion}% profil`
                              : `${user.vacancies} vakansiya • ${user.company}`
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {user.region}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`capitalize ${
                          user.role === 'employer' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {user.status === 'pending' && <UserX className="h-3 w-3 mr-1" />}
                        {user.status === 'suspended' && <XCircle className="h-3 w-3 mr-1" />}
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {user.registrationDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" title="Ko'rish">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Tahrirlash">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.status === 'active' && (
                              <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'suspended')}>
                                <UserX className="h-4 w-4 mr-2" />
                                Bloklash
                              </DropdownMenuItem>
                            )}
                            {user.status === 'suspended' && (
                              <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'active')}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Faollashtirish
                              </DropdownMenuItem>
                            )}
                            {user.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'active')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Tasdiqlash
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'suspended')}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Rad etish
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              O'chirish
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Hech qanday foydalanuvchi topilmadi
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination va Natijalar Soni */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Jami {filteredUsers.length} ta foydalanuvchi topildi
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Oldingi
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Keyingi
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}