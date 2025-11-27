import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Search, Filter, Plus, Eye, Edit, Trash2, Users, Calendar, 
  MapPin, Building, Clock, DollarSign, TrendingUp, Copy,
  MoreVertical, PauseCircle, PlayCircle, Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for vacancies
const mockVacancies = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Uzbekistan",
    location: "Toshkent",
    workType: "full-time",
    status: "active",
    experience: "3-5 years",
    salary: "$2000-$3500",
    applications: 24,
    views: 156,
    createdDate: "2024-01-15",
    deadline: "2024-02-15",
    description: "We are looking for an experienced Frontend Developer to join our team...",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    urgent: true
  },
  {
    id: 2,
    title: "Backend Node.js Developer",
    company: "Digital Solutions",
    location: "Samarqand",
    workType: "full-time",
    status: "active",
    experience: "2-4 years",
    salary: "$1800-$2500",
    applications: 18,
    views: 89,
    createdDate: "2024-01-14",
    deadline: "2024-02-10",
    description: "Join our backend team to build scalable APIs and services...",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    urgent: false
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartUp Ventures",
    location: "Remote",
    workType: "full-time",
    status: "paused",
    experience: "1-3 years",
    salary: "$1500-$2200",
    applications: 32,
    views: 203,
    createdDate: "2024-01-10",
    deadline: "2024-02-01",
    description: "We need a versatile full stack developer for our growing startup...",
    skills: ["JavaScript", "React", "Node.js", "MySQL"],
    urgent: false
  },
  {
    id: 4,
    title: "React Native Developer",
    company: "Mobile First",
    location: "Toshkent",
    workType: "contract",
    status: "closed",
    experience: "2-3 years",
    salary: "$1700-$2400",
    applications: 15,
    views: 67,
    createdDate: "2024-01-08",
    deadline: "2024-01-25",
    description: "Develop cross-platform mobile applications using React Native...",
    skills: ["React Native", "JavaScript", "Redux", "Firebase"],
    urgent: true
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Remote",
    workType: "full-time",
    status: "active",
    experience: "4-6 years",
    salary: "$2500-$3500",
    applications: 8,
    views: 45,
    createdDate: "2024-01-05",
    deadline: "2024-02-20",
    description: "Manage and optimize our cloud infrastructure and deployment pipelines...",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    urgent: false
  }
];

const statusFilters = [
  { value: "all", label: "Barchasi", count: 5 },
  { value: "active", label: "Faol", count: 3 },
  { value: "paused", label: "To'xtatilgan", count: 1 },
  { value: "closed", label: "Yopilgan", count: 1 }
];

const workTypeFilters = [
  { value: "all", label: "Barcha tur" },
  { value: "full-time", label: "To'liq ish kuni" },
  { value: "part-time", label: "Qisman ish kuni" },
  { value: "contract", label: "Kontrakt" },
  { value: "remote", label: "Masofaviy" }
];

const getStatusColor = (status: string) => {
  const colors = {
    active: "bg-green-100 text-green-700",
    paused: "bg-yellow-100 text-yellow-700",
    closed: "bg-red-100 text-red-700"
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
};

const getStatusText = (status: string) => {
  const texts = {
    active: "Faol",
    paused: "To'xtatilgan",
    closed: "Yopilgan"
  };
  return texts[status as keyof typeof texts] || "Noma'lum";
};

export default function VacanciesList() {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState(mockVacancies);
  const [filteredVacancies, setFilteredVacancies] = useState(mockVacancies);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter vacancies
  useEffect(() => {
    let result = vacancies;

    // Search filter
    if (searchTerm) {
      result = result.filter(vacancy =>
        vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(vacancy => vacancy.status === statusFilter);
    }

    // Work type filter
    if (workTypeFilter !== "all") {
      result = result.filter(vacancy => vacancy.workType === workTypeFilter);
    }

    // Sort
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (sortBy === "applications") {
      result = [...result].sort((a, b) => b.applications - a.applications);
    } else if (sortBy === "views") {
      result = [...result].sort((a, b) => b.views - a.views);
    }

    setFilteredVacancies(result);
  }, [searchTerm, statusFilter, workTypeFilter, sortBy, vacancies]);

  const handleCreateNew = () => {
    navigate("/dashboard/create-vacancy");
  };

  const handleEdit = (id: number) => {
    navigate(`/dashboard/edit-vacancy/${id}`);
    toast.info("Vakansiya tahrirlanmoqda...");
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu vakansiyani o'chirishni istaysizmi?")) {
      setVacancies(prev => prev.filter(vacancy => vacancy.id !== id));
      toast.success("Vakansiya muvaffaqiyatli o'chirildi");
    }
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    setVacancies(prev => prev.map(vacancy =>
      vacancy.id === id ? { ...vacancy, status: newStatus } : vacancy
    ));
    toast.success(`Vakansiya ${newStatus === "active" ? "faollashtirildi" : "to'xtatildi"}`);
  };

  const handleViewApplicants = (id: number) => {
    navigate(`/dashboard/applicants/${id}`);
    toast.info("Arizalar ko'rib chiqilmoqda...");
  };

  const handleDuplicate = (vacancy: any) => {
    const newVacancy = {
      ...vacancy,
      id: Math.max(...vacancies.map(v => v.id)) + 1,
      title: `${vacancy.title} (Nusxa)`,
      createdDate: new Date().toISOString().split('T')[0],
      applications: 0,
      views: 0,
      status: "active"
    };
    setVacancies(prev => [...prev, newVacancy]);
    toast.success("Vakansiya muvaffaqiyatli nusxalandi");
  };

  const handleShare = (vacancy: any) => {
    const shareText = `${vacancy.title} - ${vacancy.company} | ${vacancy.location} | ${vacancy.salary}`;
    if (navigator.share) {
      navigator.share({
        title: vacancy.title,
        text: shareText,
        url: `${window.location.origin}/vacancies/${vacancy.id}`,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Vakansiya ma'lumotlari nusxalandi!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} kun qoldi` : "Muddati tugagan";
  };

  const stats = {
    total: vacancies.length,
    active: vacancies.filter(v => v.status === 'active').length,
    applications: vacancies.reduce((sum, v) => sum + v.applications, 0),
    views: vacancies.reduce((sum, v) => sum + v.views, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mening Vakansiyalarim
            </h1>
            <p className="text-muted-foreground mt-2">
              Barcha yaratilgan vakansiyalaringiz va ularning statistikasi
            </p>
          </div>
          <Button onClick={handleCreateNew} className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Yangi Vakansiya
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Jami vakansiyalar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Faol vakansiyalar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.applications}</p>
                <p className="text-sm text-muted-foreground">Jami arizalar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.views}</p>
                <p className="text-sm text-muted-foreground">Jami ko'rishlar</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-blue-600" />
              Vakansiyalarni qidirish va filtrlash
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <Label htmlFor="search">Vakansiya nomi yoki ko'nikma bo'yicha qidirish</Label>
                <Input
                  id="search"
                  placeholder="Vakansiya nomi, kompaniya, ko'nikma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Status Filter */}
              <div>
                <Label htmlFor="status">Holat bo'yicha</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Holat" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilters.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label} ({filter.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Work Type Filter */}
              <div>
                <Label htmlFor="workType">Ish turi</Label>
                <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Ish turi" />
                  </SelectTrigger>
                  <SelectContent>
                    {workTypeFilters.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {filteredVacancies.length} ta vakansiya topildi
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort" className="text-sm">Saralash:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Yangi</SelectItem>
                      <SelectItem value="applications">Arizalar</SelectItem>
                      <SelectItem value="views">Ko'rishlar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setWorkTypeFilter("all");
                  setSortBy("newest");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrlarni tozalash
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vacancies List */}
        <div className="space-y-4">
          {filteredVacancies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Vakansiyalar topilmadi</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Sizning qidiruv va filtrlaringizga mos vakansiyalar topilmadi.
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yangi Vakansiya Yaratish
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredVacancies.map(vacancy => (
              <Card key={vacancy.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Vacancy Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold">{vacancy.title}</h3>
                            {vacancy.urgent && (
                              <Badge variant="destructive" className="animate-pulse">
                                Tez
                              </Badge>
                            )}
                            <Badge className={getStatusColor(vacancy.status)}>
                              {getStatusText(vacancy.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="font-medium">{vacancy.company}</span>
                            <span className="mx-2">•</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{vacancy.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(vacancy)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Vacancy Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{vacancy.workType}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{vacancy.salary}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{vacancy.applications} ariza</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{vacancy.views} ko'rish</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {vacancy.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Yaratilgan: {formatDate(vacancy.createdDate)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Muddati: {formatDate(vacancy.deadline)} ({getDaysRemaining(vacancy.deadline)})
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Button 
                        onClick={() => handleViewApplicants(vacancy.id)}
                        variant="default"
                        className="justify-start"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Arizalarni ko'rish ({vacancy.applications})
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(vacancy.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Tahrirlash
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(vacancy.id, vacancy.status)}
                        >
                          {vacancy.status === "active" ? (
                            <>
                              <PauseCircle className="h-4 w-4 mr-1" />
                              To'xtatish
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Faollashtirish
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicate(vacancy)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Nusxalash
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(vacancy.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          O'chirish
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Tezkor Harakatlar</CardTitle>
            <CardDescription>
              Vakansiyalaringizni boshqarish uchun tezkor vositalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center"
                onClick={handleCreateNew}
              >
                <Plus className="h-8 w-8 mb-2" />
                <span>Yangi Vakansiya</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => navigate("/dashboard/applicants")}
              >
                <Users className="h-8 w-8 mb-2" />
                <span>Barcha Arizalar</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center"
              >
                <TrendingUp className="h-8 w-8 mb-2" />
                <span>Statistika</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}