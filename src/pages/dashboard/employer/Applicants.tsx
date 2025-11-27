import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Search, Filter, Mail, Phone, MapPin, Calendar, Download, 
  Eye, MessageCircle, ThumbsUp, ThumbsDown, Star, Clock,
  Users, Building, Award, GraduationCap, Briefcase, Share2,
  ChevronDown, ChevronUp, FileText, User, Send,DollarSign
} from "lucide-react";

// Mock data for applicants
const mockApplicants = [
  {
    id: 1,
    name: "Alisher Karimov",
    email: "alisher@example.com",
    phone: "+998 90 123 45 67",
    location: "Toshkent",
    appliedDate: "2024-01-20",
    status: "review",
    statusText: "Ko'rib chiqilmoqda",
    matchScore: 92,
    experience: "5 years",
    education: "TATU, Computer Science",
    currentPosition: "Frontend Developer",
    expectedSalary: "$2500",
    resume: "AI generated professional resume...",
    skills: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS"],
    notes: [
      {
        id: 1,
        author: "Malika Karimova",
        date: "2024-01-21",
        text: "Kuchli texnik ko'nikmalar. Intervyuga taklif qilish kerak.",
        type: "positive"
      }
    ],
    communications: [
      {
        id: 1,
        type: "email",
        date: "2024-01-21",
        subject: "Ariza qabul qilindi",
        content: "Sizning arizangiz muvaffaqiyatli qabul qilindi..."
      }
    ],
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 2,
    name: "Dilshod Rahimov",
    email: "dilshod@example.com",
    phone: "+998 91 234 56 78",
    location: "Samarqand",
    appliedDate: "2024-01-19",
    status: "interview",
    statusText: "Intervyu belgilangan",
    matchScore: 87,
    experience: "3 years",
    education: "INHA University, Software Engineering",
    currentPosition: "Backend Developer",
    expectedSalary: "$2000",
    resume: "Professional backend developer resume...",
    skills: ["Node.js", "Python", "PostgreSQL", "Docker", "AWS"],
    notes: [
      {
        id: 1,
        author: "Malika Karimova",
        date: "2024-01-20",
        text: "Intervyu 25-yanvar kuni soat 14:00 da belgilandi.",
        type: "info"
      }
    ],
    communications: [],
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 3,
    name: "Sevara Alimova",
    email: "sevara@example.com",
    phone: "+998 93 345 67 89",
    location: "Remote",
    appliedDate: "2024-01-18",
    status: "accepted",
    statusText: "Qabul qilindi",
    matchScore: 95,
    experience: "4 years",
    education: "Westminster University, Computer Science",
    currentPosition: "Full Stack Developer",
    expectedSalary: "$2800",
    resume: "Full stack developer with React and Node.js...",
    skills: ["React", "Node.js", "MongoDB", "GraphQL", "TypeScript"],
    notes: [
      {
        id: 1,
        author: "Malika Karimova",
        date: "2024-01-19",
        text: "Texnik intervyudan muvaffaqiyatli o'tdi. Taklif yuborildi.",
        type: "positive"
      }
    ],
    communications: [
      {
        id: 1,
        type: "email",
        date: "2024-01-19",
        subject: "Taklif",
        content: "Sizga ish taklifimiz bilan murojaat qilamiz..."
      }
    ],
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 4,
    name: "Javohir Tursunov",
    email: "javohir@example.com",
    phone: "+998 94 456 78 90",
    location: "Toshkent",
    appliedDate: "2024-01-17",
    status: "rejected",
    statusText: "Rad etildi",
    matchScore: 65,
    experience: "1 year",
    education: "TUIT, Computer Science",
    currentPosition: "Junior Developer",
    expectedSalary: "$1200",
    resume: "Junior developer looking for opportunities...",
    skills: ["JavaScript", "React", "HTML", "CSS"],
    notes: [
      {
        id: 1,
        author: "Malika Karimova",
        date: "2024-01-18",
        text: "Tajriba talab qilinadigan darajada emas.",
        type: "negative"
      }
    ],
    communications: [
      {
        id: 1,
        type: "email",
        date: "2024-01-18",
        subject: "Arizangiz haqida",
        content: "Afsuski, sizning arizangiz rad etildi..."
      }
    ],
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 5,
    name: "Madina Xolmirzayeva",
    email: "madina@example.com",
    phone: "+998 95 567 89 01",
    location: "Buxoro",
    appliedDate: "2024-01-16",
    status: "new",
    statusText: "Yangi",
    matchScore: 78,
    experience: "2 years",
    education: "SamDU, Information Technology",
    currentPosition: "Frontend Developer",
    expectedSalary: "$1800",
    resume: "Frontend developer with React experience...",
    skills: ["React", "JavaScript", "CSS", "Git"],
    notes: [],
    communications: [],
    avatar: "/api/placeholder/40/40"
  }
];

const statusFilters = [
  { value: "all", label: "Barchasi", count: 5 },
  { value: "new", label: "Yangi", count: 1 },
  { value: "review", label: "Ko'rib chiqilmoqda", count: 1 },
  { value: "interview", label: "Intervyu", count: 1 },
  { value: "accepted", label: "Qabul qilingan", count: 1 },
  { value: "rejected", label: "Rad etilgan", count: 1 }
];

const getStatusColor = (status: string) => {
  const colors = {
    new: "bg-blue-100 text-blue-700",
    review: "bg-yellow-100 text-yellow-700",
    interview: "bg-purple-100 text-purple-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
};

const vacancyData = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp Uzbekistan",
  applications: 24,
  views: 156
};

export default function Applicants() {
  const { id } = useParams(); // vacancy ID
  const [applicants, setApplicants] = useState(mockApplicants);
  const [filteredApplicants, setFilteredApplicants] = useState(mockApplicants);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [newNote, setNewNote] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Filter applicants
  useEffect(() => {
    let result = applicants;

    // Search filter
    if (searchTerm) {
      result = result.filter(applicant =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(applicant => applicant.status === statusFilter);
    }

    // Sort
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
    } else if (sortBy === "match") {
      result = [...result].sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredApplicants(result);
  }, [searchTerm, statusFilter, sortBy, applicants]);

  const handleStatusChange = (applicantId: number, newStatus: string) => {
    setApplicants(prev => prev.map(applicant =>
      applicant.id === applicantId ? { 
        ...applicant, 
        status: newStatus,
        statusText: getStatusText(newStatus)
      } : applicant
    ));
    toast.success("Nomzod holati yangilandi");
  };

  const handleAddNote = (applicantId: number) => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now(),
      author: "Malika Karimova", // Current user
      date: new Date().toISOString().split('T')[0],
      text: newNote,
      type: "info"
    };

    setApplicants(prev => prev.map(applicant =>
      applicant.id === applicantId 
        ? { ...applicant, notes: [...applicant.notes, note] }
        : applicant
    ));

    setNewNote("");
    toast.success("Izoh qo'shildi");
  };

  const handleSendMessage = (applicantId: number) => {
    if (!newMessage.trim()) return;

    const communication = {
      id: Date.now(),
      type: "message",
      date: new Date().toISOString().split('T')[0],
      subject: "Xabar",
      content: newMessage
    };

    setApplicants(prev => prev.map(applicant =>
      applicant.id === applicantId 
        ? { 
            ...applicant, 
            communications: [...applicant.communications, communication] 
          }
        : applicant
    ));

    setNewMessage("");
    toast.success("Xabar yuborildi");
  };

  const handleDownloadResume = (applicant: any) => {
    toast.success(`${applicant.name} ning rezumesi yuklab olindi`);
  };

  const getStatusText = (status: string) => {
    const texts = {
      new: "Yangi",
      review: "Ko'rib chiqilmoqda",
      interview: "Intervyu",
      accepted: "Qabul qilingan",
      rejected: "Rad etilgan"
    };
    return texts[status as keyof typeof texts] || "Noma'lum";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stats = {
    total: applicants.length,
    new: applicants.filter(a => a.status === 'new').length,
    interview: applicants.filter(a => a.status === 'interview').length,
    accepted: applicants.filter(a => a.status === 'accepted').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Nomzodlar
            </h1>
            <p className="text-muted-foreground mt-2">
              {vacancyData.title} - {vacancyData.company}
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Badge variant="secondary">
              {vacancyData.applications} ariza
            </Badge>
            <Badge variant="secondary">
              {vacancyData.views} ko'rish
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Jami nomzodlar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.new}</p>
                <p className="text-sm text-muted-foreground">Yangi arizalar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.interview}</p>
                <p className="text-sm text-muted-foreground">Intervyu</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <ThumbsUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.accepted}</p>
                <p className="text-sm text-muted-foreground">Qabul qilingan</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Applicants List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-purple-600" />
                  Nomzodlarni qidirish va filtrlash
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <Label htmlFor="search">Ism, email yoki ko'nikma bo'yicha qidirish</Label>
                    <Input
                      id="search"
                      placeholder="Nomzod ismi, email, ko'nikma..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-1"
                    />
                  </div>

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
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {filteredApplicants.length} ta nomzod topildi
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="sort" className="text-sm">Saralash:</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Yangi</SelectItem>
                          <SelectItem value="match">Moslik</SelectItem>
                          <SelectItem value="name">Ism</SelectItem>
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
                      setSortBy("newest");
                    }}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrlarni tozalash
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Applicants List */}
            <div className="space-y-4">
              {filteredApplicants.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nomzodlar topilmadi</h3>
                    <p className="text-muted-foreground text-center">
                      Sizning qidiruv va filtrlaringizga mos nomzodlar topilmadi.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredApplicants.map(applicant => (
                  <Card 
                    key={applicant.id} 
                    className={`hover:shadow-lg transition-shadow cursor-pointer ${
                      selectedApplicant?.id === applicant.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={applicant.avatar} />
                          <AvatarFallback>
                            {applicant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div>
                              <h3 className="text-lg font-semibold truncate">{applicant.name}</h3>
                              <div className="flex items-center text-muted-foreground text-sm mt-1">
                                <Mail className="h-4 w-4 mr-1" />
                                <span className="truncate">{applicant.email}</span>
                                <span className="mx-2">•</span>
                                <Phone className="h-4 w-4 mr-1" />
                                <span>{applicant.phone}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(applicant.status)}>
                                {applicant.statusText}
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                {applicant.matchScore}% moslik
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 text-sm">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{applicant.currentPosition}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{applicant.location}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{applicant.expectedSalary}</span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {applicant.skills.slice(0, 4).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                                  {skill}
                                </Badge>
                              ))}
                              {applicant.skills.length > 4 && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                  +{applicant.skills.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Ariza: {formatDate(applicant.appliedDate)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadResume(applicant);
                                }}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Rezyume
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Applicant Details Sidebar */}
          <div className="space-y-6">
            {selectedApplicant ? (
              <>
                {/* Applicant Profile Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Nomzod Ma'lumotlari</span>
                      <Badge className={getStatusColor(selectedApplicant.status)}>
                        {selectedApplicant.statusText}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedApplicant.avatar} />
                        <AvatarFallback className="text-lg">
                          {selectedApplicant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{selectedApplicant.name}</h3>
                        <p className="text-muted-foreground">{selectedApplicant.currentPosition}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {selectedApplicant.location}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{selectedApplicant.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{selectedApplicant.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Kutilayotgan maosh: {selectedApplicant.expectedSalary}</span>
                      </div>
                    </div>

                    <div>
                      <Label>Moslik darajasi</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={selectedApplicant.matchScore} className="flex-1" />
                        <span className="text-sm font-medium">{selectedApplicant.matchScore}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(selectedApplicant.id, "accepted")}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Qabul qilish
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(selectedApplicant.id, "rejected")}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Rad etish
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Holatni Boshqarish</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {["new", "review", "interview", "accepted", "rejected"].map(status => (
                        <Button
                          key={status}
                          variant={selectedApplicant.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(selectedApplicant.id, status)}
                          className="justify-start"
                        >
                          {getStatusText(status)}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tezkor Harakatlar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email yuborish
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Xabar yuborish
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Intervyu belgilash
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Rezyumeni yuklab olish
                    </Button>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Izohlar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedApplicant.notes.map((note: any) => (
                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{note.author}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(note.date)}</span>
                          </div>
                          <p className="text-sm">{note.text}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Yangi izoh qo'shing..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleAddNote(selectedApplicant.id)}
                        disabled={!newNote.trim()}
                      >
                        Izoh qo'shish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nomzod tanlang</h3>
                  <p className="text-muted-foreground text-center">
                    Batafsil ma'lumotlarni ko'rish uchun nomzodni tanlang
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}