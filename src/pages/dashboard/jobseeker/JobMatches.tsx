    import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Filter, MapPin, Briefcase, Clock, DollarSign, Building, Star, Bookmark, Share2 } from "lucide-react";

// Mock data - keyin real API bilan almashtiriladi
const mockJobMatches = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Uzbekistan",
    location: "Toshkent",
    type: "Full-time",
    salary: "$2000-$3000",
    experience: "3-5 years",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    match: 95,
    description: "We are looking for an experienced Frontend Developer to join our team...",
    postedDate: "2024-01-15",
    isSaved: false,
    urgency: "high"
  },
  {
    id: 2,
    title: "Backend Node.js Developer",
    company: "Digital Solutions",
    location: "Samarqand",
    type: "Full-time",
    salary: "$1800-$2500",
    experience: "2-4 years",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    match: 87,
    description: "Join our backend team to build scalable APIs and services...",
    postedDate: "2024-01-14",
    isSaved: true,
    urgency: "medium"
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartUp Ventures",
    location: "Remote",
    type: "Full-time",
    salary: "$1500-$2200",
    experience: "1-3 years",
    skills: ["JavaScript", "React", "Node.js", "MySQL"],
    match: 78,
    description: "We need a versatile full stack developer for our growing startup...",
    postedDate: "2024-01-13",
    isSaved: false,
    urgency: "low"
  },
  {
    id: 4,
    title: "React Native Developer",
    company: "Mobile First",
    location: "Toshkent",
    type: "Contract",
    salary: "$1700-$2400",
    experience: "2-3 years",
    skills: ["React Native", "JavaScript", "Redux", "Firebase"],
    match: 92,
    description: "Develop cross-platform mobile applications using React Native...",
    postedDate: "2024-01-12",
    isSaved: false,
    urgency: "high"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Remote",
    type: "Full-time",
    salary: "$2500-$3500",
    experience: "4-6 years",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    match: 65,
    description: "Manage and optimize our cloud infrastructure and deployment pipelines...",
    postedDate: "2024-01-11",
    isSaved: true,
    urgency: "medium"
  }
];

const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Remote", "Internship"];
const locations = ["All", "Toshkent", "Samarqand", "Remote", "Buxoro", "Andijon"];
const experienceLevels = ["All", "Entry", "1-2 years", "3-5 years", "5+ years"];

export default function JobMatches() {
  const [jobs, setJobs] = useState(mockJobMatches);
  const [filteredJobs, setFilteredJobs] = useState(mockJobMatches);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    location: "All",
    experience: "All",
    minSalary: ""
  });
  const [savedJobs, setSavedJobs] = useState<number[]>([2, 5]);

  // Filter jobs based on search and filters
  useEffect(() => {
    let result = jobs;

    // Search filter
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (filters.type !== "All") {
      result = result.filter(job => job.type === filters.type);
    }

    // Location filter
    if (filters.location !== "All") {
      result = result.filter(job => job.location === filters.location);
    }

    // Experience filter
    if (filters.experience !== "All") {
      result = result.filter(job => job.experience.includes(filters.experience));
    }

    setFilteredJobs(result);
  }, [searchTerm, filters, jobs]);

  const handleSaveJob = (jobId: number) => {
    setSavedJobs(prev => {
      const newSaved = prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      
      // Update job saved status
      setJobs(prevJobs => prevJobs.map(job =>
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      ));

      // Show toast
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        if (!prev.includes(jobId)) {
          toast.success(`"${job.title}" saqlandi`);
        } else {
          toast.info(`"${job.title}" saqlanganlar ro'yxatidan olindi`);
        }
      }

      return newSaved;
    });
  };

  const handleShareJob = (job: any) => {
    const shareText = `${job.title} - ${job.company} | ${job.location} | ${job.salary}`;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Ish haqida ma'lumot nusxalandi!");
    }
  };

  const handleApply = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast.success(`"${job.title}" ga ariza yuborildi!`);
      // Keyin bu yerda haqiqiy ariza yuborish logikasi bo'ladi
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-100 text-green-700";
    if (match >= 80) return "bg-blue-100 text-blue-700";
    if (match >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getUrgencyBadge = (urgency: string) => {
    const config = {
      high: { color: "bg-red-100 text-red-700", text: "Tez" },
      medium: { color: "bg-yellow-100 text-yellow-700", text: "O'rta" },
      low: { color: "bg-gray-100 text-gray-700", text: "Oddiy" }
    };
    return config[urgency as keyof typeof config] || config.low;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Ish O'rinlari
          </h1>
          <p className="text-muted-foreground mt-2">
            Sizning ko'nikmalaringizga mos keladigan ish o'rinlari
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-purple-600" />
              Qidiruv va Filtrlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Search Input */}
              <div className="lg:col-span-2">
                <Label htmlFor="search">Ish qidirish</Label>
                <Input
                  id="search"
                  placeholder="Ish nomi, kompaniya yoki ko'nikmalar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Job Type Filter */}
              <div>
                <Label htmlFor="type">Ish turi</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div>
                <Label htmlFor="location">Manzil</Label>
                <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Filter */}
              <div>
                <Label htmlFor="experience">Tajriba</Label>
                <Select value={filters.experience} onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {filteredJobs.length} ta ish topildi
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ type: "All", location: "All", experience: "All", minSalary: "" });
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrlarni tozalash
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="grid gap-6">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ish topilmadi</h3>
                <p className="text-muted-foreground text-center">
                  Sizning qidiruv va filtrlaringizga mos ish o'rinlari topilmadi. <br />
                  Iltimos, filtrlarni o'zgartirib ko'ring.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge className={getMatchColor(job.match)}>
                              {job.match}% moslik
                            </Badge>
                            <Badge className={getUrgencyBadge(job.urgency).color}>
                              {getUrgencyBadge(job.urgency).text}
                            </Badge>
                          </div>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareJob(job)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={job.isSaved ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSaveJob(job.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${job.isSaved ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {job.experience}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          {job.salary}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <Label className="text-sm mb-2">Talab qilinadigan ko'nikmalar:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Button 
                        onClick={() => handleApply(job.id)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Ariza yuborish
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={`/jobs/${job.id}`} target="_blank" rel="noopener noreferrer">
                          Batafsil ma'lumot
                        </a>
                      </Button>
                      <div className="text-xs text-muted-foreground text-center">
                        {new Date(job.postedDate).toLocaleDateString('uz-UZ')} da joylangan
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{jobs.filter(j => j.match >= 90).length}</p>
                <p className="text-sm text-muted-foreground">Yuqori moslik</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Bookmark className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Saqlangan ishlar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-sm text-muted-foreground">Jami takliflar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}