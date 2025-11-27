import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { jobService } from "@/services/jobs";
import { applicationService } from "@/services/applications";
import { Search, Filter, MapPin, Briefcase, Clock, DollarSign, Building, Star, Bookmark, Share2, Loader2 } from "lucide-react";
import type { JobMatch } from "@/services/jobs";

const jobTypes = ["All", "full-time", "part-time", "contract", "remote", "internship"];
const locations = ["All", "Toshkent", "Samarqand", "Remote", "Buxoro", "Andijon"];
const experienceLevels = ["All", "Entry", "1-2 years", "3-5 years", "5+ years"];

export default function JobMatches() {
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    location: "All",
    experience: "All",
    minSalary: ""
  });

  // Fetch job matches on component mount
  useEffect(() => {
    loadJobMatches();
  }, []);

  const loadJobMatches = async () => {
    try {
      setIsLoading(true);
      const matches = await jobService.getMatches();
      setJobs(matches);
      setFilteredJobs(matches);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ish o'rinlarini yuklashda xatolik yuz berdi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter jobs based on search and filters
  useEffect(() => {
    let result = jobs;

    // Search filter
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Type filter
    if (filters.type !== "All") {
      result = result.filter(job => job.workType === filters.type);
    }

    // Location filter
    if (filters.location !== "All") {
      result = result.filter(job => job.location?.toLowerCase().includes(filters.location.toLowerCase()));
    }

    // Experience filter
    if (filters.experience !== "All") {
      result = result.filter(job => {
        const expYears = job.experienceYears || "";
        return expYears.includes(filters.experience);
      });
    }

    setFilteredJobs(result);
  }, [searchTerm, filters, jobs]);

  const handleSaveJob = async (jobId: string) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      if (job.isSaved) {
        await jobService.unsave(jobId);
        toast.info(`"${job.title}" saqlanganlar ro'yxatidan olindi`);
      } else {
        await jobService.save(jobId);
        toast.success(`"${job.title}" saqlandi`);
      }
      
      // Update local state
      setJobs(prevJobs => prevJobs.map(j =>
        j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
      ));
      setFilteredJobs(prevJobs => prevJobs.map(j =>
        j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
      ));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Xatolik yuz berdi";
      toast.error(errorMessage);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      if (job.alreadyApplied) {
        toast.info("Siz allaqachon bu vakansiyaga ariza yuborgansiz");
        return;
      }

      await applicationService.create(jobId);
      toast.success(`"${job.title}" ga ariza yuborildi!`);
      
      // Update local state
      setJobs(prevJobs => prevJobs.map(j =>
        j.id === jobId ? { ...j, alreadyApplied: true } : j
      ));
      setFilteredJobs(prevJobs => prevJobs.map(j =>
        j.id === jobId ? { ...j, alreadyApplied: true } : j
      ));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ariza yuborishda xatolik yuz berdi";
      toast.error(errorMessage);
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-100 text-green-700";
    if (match >= 80) return "bg-blue-100 text-blue-700";
    if (match >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const handleShareJob = (job: JobMatch) => {
    const shareText = `${job.title} - ${job.company} | ${job.location}`;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // Share cancelled or failed
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Ish haqida ma'lumot nusxalandi!");
    }
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
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : filteredJobs.length === 0 ? (
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
                            <Badge className={getMatchColor(job.matchScore)}>
                              {job.matchScore}% moslik
                            </Badge>
                            {job.urgent && (
                              <Badge className="bg-red-100 text-red-700">
                                Tez
                              </Badge>
                            )}
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
                          {job.workType}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {job.experienceYears || "Ko'rsatilmagan"}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          {job.salaryMin && job.salaryMax 
                            ? `$${job.salaryMin}-$${job.salaryMax}`
                            : "Ko'rsatilmagan"}
                        </div>
                      </div>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
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
                      )}

                      {/* Description */}
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Button 
                        onClick={() => handleApply(job.id)}
                        disabled={job.alreadyApplied}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {job.alreadyApplied ? "Ariza yuborilgan" : "Ariza yuborish"}
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={`/vacancies/${job.id}`} target="_blank" rel="noopener noreferrer">
                          Batafsil ma'lumot
                        </a>
                      </Button>
                      <div className="text-xs text-muted-foreground text-center">
                        {new Date(job.createdAt).toLocaleDateString('uz-UZ')} da joylangan
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
                <p className="text-2xl font-bold">{jobs.filter(j => j.matchScore >= 90).length}</p>
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
                <p className="text-2xl font-bold">{jobs.filter(j => j.isSaved).length}</p>
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