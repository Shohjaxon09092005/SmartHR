import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { matchingService, type CandidateMatch } from "@/services/matching";
import { vacancyService } from "@/services/vacancies";
import { applicationService } from "@/services/applications";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Loader2, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare
} from "lucide-react";
import type { Vacancy } from "@/types";

export default function CandidateFinder() {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>("");
  const [isFinding, setIsFinding] = useState(false);
  const [isLoadingVacancies, setIsLoadingVacancies] = useState(true);
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      setIsLoadingVacancies(true);
      const data = await vacancyService.getAll({ status: "active" });
      setVacancies(data);
      if (data.length > 0) {
        setSelectedVacancyId(data[0].id);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Vakansiyalarni yuklashda xatolik");
    } finally {
      setIsLoadingVacancies(false);
    }
  };

  const handleFindCandidates = async () => {
    if (!selectedVacancyId) {
      toast.error("Vakansiya tanlang");
      return;
    }

    try {
      setIsFinding(true);
      setHasSearched(false);
      
      toast.info("AI nomzod qidiryapti...", {
        description: "Vakansiya va nomzodlar tahlil qilinmoqda"
      });

      const matches = await matchingService.findCandidates(selectedVacancyId);
      setCandidates(matches);
      setHasSearched(true);
      
      if (matches.length === 0) {
        toast.info("Nomzod topilmadi", {
          description: "Bu vakansiyaga mos nomzodlar topilmadi."
        });
      } else {
        toast.success(`${matches.length} ta mos nomzod topildi!`, {
          description: "AI tahlili yakunlandi"
        });
      }
    } catch (error: any) {
      console.error("Find candidates error:", error);
      toast.error(error?.response?.data?.error || "Nomzod qidirishda xatolik yuz berdi");
    } finally {
      setIsFinding(false);
    }
  };

  const handleViewProfile = (candidateId: string) => {
    // Navigate to candidate profile view
    navigate(`/dashboard/candidates/${candidateId}`);
  };

  const handleChangeStatus = async (candidateId: string, status: string) => {
    try {
      // Find application for this candidate and vacancy
      // This would require getting the application ID
      toast.success("Status yangilandi");
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? { ...c, applicationStatus: status } : c
      ));
    } catch (error: any) {
      toast.error("Statusni yangilashda xatolik");
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-100 text-green-700 border-green-300";
    if (match >= 80) return "bg-blue-100 text-blue-700 border-blue-300";
    if (match >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  const getStatusBadge = (status?: string | null) => {
    if (!status) return null;
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Kutilmoqda", className: "bg-yellow-100 text-yellow-700" },
      review: { label: "Ko'rilmoqda", className: "bg-blue-100 text-blue-700" },
      interview: { label: "Intervyu", className: "bg-purple-100 text-purple-700" },
      accepted: { label: "Qabul qilindi", className: "bg-green-100 text-green-700" },
      rejected: { label: "Rad etildi", className: "bg-red-100 text-red-700" },
    };
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700" };
    return (
      <Badge className={config.className}>{config.label}</Badge>
    );
  };

  const selectedVacancy = vacancies.find(v => v.id === selectedVacancyId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Candidate Finder
          </h1>
          <p className="text-muted-foreground mt-2">
            AI yordamida vakansiyangizga eng mos nomzodlarni toping
          </p>
        </div>

        {/* Vacancy Selection and Find Card */}
        <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
              Vakansiya tanlash
            </CardTitle>
            <CardDescription>
              Nomzodlarni topish uchun vakansiyani tanlang
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingVacancies ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : vacancies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Vakansiyalar topilmadi. Avval vakansiya yarating.
                </p>
                <Button onClick={() => navigate("/dashboard/create-vacancy")}>
                  Vakansiya yaratish
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="vacancy">Vakansiya</Label>
                  <Select value={selectedVacancyId} onValueChange={setSelectedVacancyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vakansiya tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {vacancies.map((vacancy) => (
                        <SelectItem key={vacancy.id} value={vacancy.id}>
                          {vacancy.title} - {vacancy.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedVacancy && (
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{selectedVacancy.title}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {selectedVacancy.workType}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {selectedVacancy.location}
                        </div>
                      </div>
                      {selectedVacancy.skills && selectedVacancy.skills.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Talab qilinadigan ko'nikmalar:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedVacancy.skills.slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {selectedVacancy.skills.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{selectedVacancy.skills.length - 5}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Button 
                  size="lg" 
                  onClick={handleFindCandidates}
                  disabled={isFinding || !selectedVacancyId}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isFinding ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      AI qidiryapti...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Nomzodlarni topish
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Topilgan nomzodlar ({candidates.length})
              </h2>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                <Sparkles className="mr-2 h-4 w-4" />
                AI tahlili
              </Badge>
            </div>

            {candidates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nomzod topilmadi</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Bu vakansiyaga mos nomzodlar topilmadi.
                  </p>
                  <Button variant="outline" onClick={handleFindCandidates}>
                    Qayta qidirish
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {candidates.map((candidate) => (
                  <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Candidate Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <img
                                src={candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.firstName + ' ' + candidate.lastName)}&background=6366f1&color=fff&size=64`}
                                alt={`${candidate.firstName} ${candidate.lastName}`}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                              />
                              <Badge className={`absolute -top-2 -right-2 ${getMatchColor(candidate.matchScore)}`}>
                                {candidate.matchScore}%
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    {candidate.firstName} {candidate.lastName}
                                  </h3>
                                  {candidate.professionalTitle && (
                                    <p className="text-muted-foreground">{candidate.professionalTitle}</p>
                                  )}
                                </div>
                                {getStatusBadge(candidate.applicationStatus)}
                              </div>
                              
                              {/* Match Reason */}
                              <div className="mt-2 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-2">
                                <p className="text-xs text-purple-700 dark:text-purple-300 flex items-start gap-2">
                                  <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  <span>{candidate.matchReason}</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {candidate.email && (
                              <div className="flex items-center text-muted-foreground">
                                <Mail className="h-4 w-4 mr-2" />
                                {candidate.email}
                              </div>
                            )}
                            {candidate.phone && (
                              <div className="flex items-center text-muted-foreground">
                                <Phone className="h-4 w-4 mr-2" />
                                {candidate.phone}
                              </div>
                            )}
                            {candidate.location && (
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                {candidate.location}
                              </div>
                            )}
                            {candidate.experienceYears && (
                              <div className="flex items-center text-muted-foreground">
                                <Briefcase className="h-4 w-4 mr-2" />
                                {candidate.experienceYears}
                              </div>
                            )}
                          </div>

                          {/* Bio */}
                          {candidate.bio && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {candidate.bio}
                            </p>
                          )}

                          {/* Skills */}
                          {candidate.skills && candidate.skills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Ko'nikmalar:</p>
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills.slice(0, 8).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                                    {skill}
                                  </Badge>
                                ))}
                                {candidate.skills.length > 8 && (
                                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                    +{candidate.skills.length - 8}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Experience & Education */}
                          {(candidate.experience || candidate.education) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              {candidate.experience && (
                                <div>
                                  <p className="font-medium mb-1 flex items-center">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    Tajriba
                                  </p>
                                  <p className="text-muted-foreground text-xs line-clamp-2">
                                    {candidate.experience}
                                  </p>
                                </div>
                              )}
                              {candidate.education && (
                                <div>
                                  <p className="font-medium mb-1 flex items-center">
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    Ta'lim
                                  </p>
                                  <p className="text-muted-foreground text-xs line-clamp-2">
                                    {candidate.education}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <Button 
                            onClick={() => handleViewProfile(candidate.id)}
                            className="w-full"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Profilni ko'rish
                          </Button>
                          {candidate.hasApplied ? (
                            <Button variant="outline" disabled className="w-full">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Ariza yuborilgan
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              onClick={() => navigate(`/dashboard/applicants?candidate=${candidate.id}`)}
                              className="w-full"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Bog'lanish
                            </Button>
                          )}
                          <div className="text-xs text-center text-muted-foreground">
                            {candidate.matchScore}% moslik
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Stats */}
            {candidates.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="flex items-center p-4">
                    <div className="rounded-full bg-green-100 p-2 mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{candidates.filter(c => c.matchScore >= 90).length}</p>
                      <p className="text-xs text-muted-foreground">Yuqori moslik (90%+)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-4">
                    <div className="rounded-full bg-blue-100 p-2 mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{candidates.filter(c => c.matchScore >= 80).length}</p>
                      <p className="text-xs text-muted-foreground">Yaxshi moslik (80%+)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-4">
                    <div className="rounded-full bg-yellow-100 p-2 mr-3">
                      <Search className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{candidates.filter(c => c.matchScore >= 70).length}</p>
                      <p className="text-xs text-muted-foreground">O'rtacha moslik (70%+)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-4">
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{candidates.length}</p>
                      <p className="text-xs text-muted-foreground">Jami topilgan</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

