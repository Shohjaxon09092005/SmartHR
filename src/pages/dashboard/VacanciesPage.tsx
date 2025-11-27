import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Briefcase,
  Building,
  Users,
  DollarSign,
  Clock,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

// Mock ma'lumotlar
const mockVacancies = [
  { 
    id: "1", 
    title: "Frontend Developer", 
    company: "Tech Solutions", 
    companyEmail: "hr@techsolutions.uz",
    companyPhone: "+998901234567",
    region: "Toshkent",
    applicants: 15, 
    status: "active",
    salary: "2000-2500$",
    postedDate: "2024-03-15",
    category: "Texnologiya",
    employmentType: "To'liq ish kuni",
    experience: "3-5 yil",
    deadline: "2024-04-15",
    views: 245,
    description: "Vue.js va React.js bilen ishlash tajribasi talab etiladi..."
  },
  { 
    id: "2", 
    title: "Backend Developer", 
    company: "Digital Agency", 
    companyEmail: "career@digital.uz",
    companyPhone: "+998901234568",
    region: "Toshkent",
    applicants: 8, 
    status: "active",
    salary: "1800-2200$",
    postedDate: "2024-03-10",
    category: "Texnologiya",
    employmentType: "To'liq ish kuni",
    experience: "2-4 yil",
    deadline: "2024-04-10",
    views: 189,
    description: "Node.js, Python va MongoDB bilen ishlash ko'nikmasi..."
  },
  { 
    id: "3", 
    title: "UI/UX Designer", 
    company: "Creative Studio", 
    companyEmail: "info@creative.uz",
    companyPhone: "+998901234569",
    region: "Samarqand",
    applicants: 12, 
    status: "pending",
    salary: "1500-1800$",
    postedDate: "2024-03-18",
    category: "Dizayn",
    employmentType: "To'liq ish kuni",
    experience: "2-3 yil",
    deadline: "2024-04-18",
    views: 156,
    description: "Figma, Adobe Creative Suite va prototiplash tajribasi..."
  },
  { 
    id: "4", 
    title: "Project Manager", 
    company: "Consulting Group", 
    companyEmail: "hr@consulting.uz",
    companyPhone: "+998901234570",
    region: "Buxoro",
    applicants: 6, 
    status: "active",
    salary: "2200-2800$",
    postedDate: "2024-03-12",
    category: "Menejment",
    employmentType: "To'liq ish kuni",
    experience: "5+ yil",
    deadline: "2024-04-12",
    views: 178,
    description: "Loyiha boshqaruvi va jamoa rahbarligi tajribasi..."
  },
  { 
    id: "5", 
    title: "Data Scientist", 
    company: "AI Innovations", 
    companyEmail: "jobs@aiinnovations.uz",
    companyPhone: "+998901234571",
    region: "Toshkent",
    applicants: 9, 
    status: "expired",
    salary: "2500-3000$",
    postedDate: "2024-02-20",
    category: "Texnologiya",
    employmentType: "To'liq ish kuni",
    experience: "4-6 yil",
    deadline: "2024-03-20",
    views: 234,
    description: "Machine Learning va Data Analysis sohasida chuqur bilim..."
  },
];

const regions = [
  "Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", 
  "Namangan", "Qashqadaryo", "Surxandaryo", "Jizzax", "Sirdaryo",
  "Navoiy", "Xorazm", "Qoraqalpog'iston"
];

const categories = [
  "Texnologiya", "Dizayn", "Menejment", "Marketing", "Moliya",
  "Sotuv", "Xizmat ko'rsatish", "Ishlab chiqarish", "Qurilish", "Ta'lim"
];

const employmentTypes = [
  "To'liq ish kuni", "Yarim ish kuni", "Masofaviy ish", "Loyiha asosida", "Stajyorlik"
];

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState(mockVacancies);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Filtrlash funksiyasi
  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = 
      vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || vacancy.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || vacancy.category === categoryFilter;
    const matchesRegion = regionFilter === "all" || vacancy.region === regionFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesRegion;
  });

  // Statusni o'zgartirish
  const updateVacancyStatus = (vacancyId, newStatus) => {
    setVacancies(vacancies.map(vacancy => 
      vacancy.id === vacancyId ? { ...vacancy, status: newStatus } : vacancy
    ));
  };

  // Vakansiyani o'chirish
  const deleteVacancy = (vacancyId) => {
    if (confirm("Vakansiyani o'chirishni tasdiqlaysizmi?")) {
      setVacancies(vacancies.filter(vacancy => vacancy.id !== vacancyId));
    }
  };

  // Vakansiyani tahrirlash
  const handleEdit = (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsEditModalOpen(true);
  };

  // Vakansiyani ko'rish
  const handleView = (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsViewModalOpen(true);
  };

  // Tahrirlashni saqlash
  const handleSaveEdit = (updatedVacancy) => {
    setVacancies(vacancies.map(vacancy => 
      vacancy.id === updatedVacancy.id ? updatedVacancy : vacancy
    ));
    setIsEditModalOpen(false);
    setSelectedVacancy(null);
  };

  // Yangi vakansiya qo'shish
  const handleAddNew = () => {
    setSelectedVacancy({
      id: Date.now().toString(),
      title: "",
      company: "",
      companyEmail: "",
      companyPhone: "",
      region: "",
      applicants: 0,
      status: "pending",
      salary: "",
      postedDate: new Date().toISOString().split('T')[0],
      category: "",
      employmentType: "",
      experience: "",
      deadline: "",
      views: 0,
      description: ""
    });
    setIsEditModalOpen(true);
  };

  // Statistik ma'lumotlar
  const stats = {
    total: vacancies.length,
    active: vacancies.filter(v => v.status === "active").length,
    pending: vacancies.filter(v => v.status === "pending").length,
    expired: vacancies.filter(v => v.status === "expired").length,
    totalApplicants: vacancies.reduce((sum, v) => sum + v.applicants, 0),
    totalViews: vacancies.reduce((sum, v) => sum + v.views, 0),
  };

  // Status ranglari
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status ikonkasi
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'pending': return <Clock className="h-3 w-3 mr-1" />;
      case 'expired': return <AlertCircle className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Sarlavha va Harakatlar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Vakansiyalar Boshqaruvi</h1>
            <p className="text-muted-foreground">Barcha vakansiyalarni ko'rish va boshqarish</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
              Yangi Vakansiya
            </Button>
          </div>
        </div>

        {/* Statistik Kartalar */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jami Vakansiyalar</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Faol Vakansiyalar</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jami Nomzodlar</p>
                  <p className="text-2xl font-bold">{stats.totalApplicants}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Jami Ko'rishlar</p>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Eye className="h-6 w-6 text-orange-600" />
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
                    placeholder="Vakansiya nomi, kompaniya yoki kategoriya bo'yicha qidirish..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtrlar */}
              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha Status</SelectItem>
                    <SelectItem value="active">Faol</SelectItem>
                    <SelectItem value="pending">Kutilmoqda</SelectItem>
                    <SelectItem value="expired">Muddati O'tgan</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Kategoriya" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha Kategoriyalar</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
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

        {/* Vakansiyalar Jadvali */}
        <Card>
          <CardHeader>
            <CardTitle>Vakansiyalar Ro'yxati</CardTitle>
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
                  <TableHead>Ko'rishlar</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVacancies.map((vacancy) => (
                  <TableRow key={vacancy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vacancy.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {vacancy.postedDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {vacancy.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {vacancy.region}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        {vacancy.salary}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {vacancy.applicants} ta
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {vacancy.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vacancy.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${getStatusColor(vacancy.status)}`}>
                        {getStatusIcon(vacancy.status)}
                        {vacancy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          title="Ko'rish"
                          onClick={() => handleView(vacancy)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          title="Tahrirlash"
                          onClick={() => handleEdit(vacancy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <div className="group relative">
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block w-48">
                            <div className="py-1">
                              {vacancy.status !== 'active' && (
                                <button 
                                  className="flex items-center px-3 py-2 text-sm w-full hover:bg-gray-100"
                                  onClick={() => updateVacancyStatus(vacancy.id, 'active')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Faollashtirish
                                </button>
                              )}
                              {vacancy.status !== 'pending' && (
                                <button 
                                  className="flex items-center px-3 py-2 text-sm w-full hover:bg-gray-100"
                                  onClick={() => updateVacancyStatus(vacancy.id, 'pending')}
                                >
                                  <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                                  Kutilmoqda
                                </button>
                              )}
                              {vacancy.status !== 'expired' && (
                                <button 
                                  className="flex items-center px-3 py-2 text-sm w-full hover:bg-gray-100"
                                  onClick={() => updateVacancyStatus(vacancy.id, 'expired')}
                                >
                                  <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                                  Muddati O'tgan
                                </button>
                              )}
                              <button 
                                className="flex items-center px-3 py-2 text-sm w-full hover:bg-gray-100 text-red-600"
                                onClick={() => deleteVacancy(vacancy.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                O'chirish
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredVacancies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Hech qanday vakansiya topilmadi
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination va Natijalar Soni */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Jami {filteredVacancies.length} ta vakansiya topildi
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

      {/* Vakansiyani Ko'rish Modali */}
      {isViewModalOpen && selectedVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedVacancy.title}</h3>
              <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kompaniya</label>
                  <p className="font-medium">{selectedVacancy.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Viloyat</label>
                  <p className="font-medium">{selectedVacancy.region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Maosh</label>
                  <p className="font-medium">{selectedVacancy.salary}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ish turi</label>
                  <p className="font-medium">{selectedVacancy.employmentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tajriba</label>
                  <p className="font-medium">{selectedVacancy.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Muddati</label>
                  <p className="font-medium">{selectedVacancy.deadline}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Kontakt Ma'lumotlari</label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{selectedVacancy.companyEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{selectedVacancy.companyPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Tavsif</label>
                <p className="mt-1 text-sm">{selectedVacancy.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedVacancy.applicants}</div>
                  <div className="text-sm text-muted-foreground">Nomzodlar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedVacancy.views}</div>
                  <div className="text-sm text-muted-foreground">Ko'rishlar</div>
                </div>
                <div className="text-center">
                  <Badge className={getStatusColor(selectedVacancy.status)}>
                    {selectedVacancy.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vakansiyani Tahrirlash Modali */}
      {isEditModalOpen && selectedVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {selectedVacancy.id.startsWith('temp') ? 'Yangi Vakansiya' : 'Vakansiyani Tahrirlash'}
              </h3>
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Vakansiya Nomi</label>
                  <Input 
                    value={selectedVacancy.title} 
                    onChange={(e) => setSelectedVacancy({...selectedVacancy, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Kompaniya</label>
                  <Input 
                    value={selectedVacancy.company} 
                    onChange={(e) => setSelectedVacancy({...selectedVacancy, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Viloyat</label>
                  <Select 
                    value={selectedVacancy.region} 
                    onValueChange={(value) => setSelectedVacancy({...selectedVacancy, region: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Viloyat tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Kategoriya</label>
                  <Select 
                    value={selectedVacancy.category} 
                    onValueChange={(value) => setSelectedVacancy({...selectedVacancy, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriya tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Maosh</label>
                  <Input 
                    value={selectedVacancy.salary} 
                    onChange={(e) => setSelectedVacancy({...selectedVacancy, salary: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ish turi</label>
                  <Select 
                    value={selectedVacancy.employmentType} 
                    onValueChange={(value) => setSelectedVacancy({...selectedVacancy, employmentType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ish turi tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tajriba</label>
                  <Input 
                    value={selectedVacancy.experience} 
                    onChange={(e) => setSelectedVacancy({...selectedVacancy, experience: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Muddati</label>
                  <Input 
                    type="date"
                    value={selectedVacancy.deadline} 
                    onChange={(e) => setSelectedVacancy({...selectedVacancy, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Kontakt Email</label>
                <Input 
                  value={selectedVacancy.companyEmail} 
                  onChange={(e) => setSelectedVacancy({...selectedVacancy, companyEmail: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Kontakt Telefon</label>
                <Input 
                  value={selectedVacancy.companyPhone} 
                  onChange={(e) => setSelectedVacancy({...selectedVacancy, companyPhone: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tavsif</label>
                <textarea 
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  value={selectedVacancy.description} 
                  onChange={(e) => setSelectedVacancy({...selectedVacancy, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select 
                  value={selectedVacancy.status} 
                  onValueChange={(value) => setSelectedVacancy({...selectedVacancy, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Faol</SelectItem>
                    <SelectItem value="pending">Kutilmoqda</SelectItem>
                    <SelectItem value="expired">Muddati O'tgan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button onClick={() => handleSaveEdit(selectedVacancy)}>
                  Saqlash
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}