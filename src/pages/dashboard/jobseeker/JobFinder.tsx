import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { matchingService } from "@/services/matching";
import { applicationService } from "@/services/applications";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building, 
  Loader2, 
  Sparkles,
  CheckCircle,
  Bookmark,
  Share2
} from "lucide-react";
import type { JobMatch } from "@/services/jobs";

export default function JobFinder() {
  const [isFinding, setIsFinding] = useState(false);
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFindJobs = async () => {
    try {
      setIsFinding(true);
      setHasSearched(false);
      
      toast.info("AI ish qidiryapti...", {
        description: "Profil va vakansiyalar tahlil qilinmoqda"
      });

      const matches = await matchingService.findJobs();
      setJobs(matches);
      setHasSearched(true);
      
      if (matches.length === 0) {
        toast.info("Ish topilmadi", {
          description: "Sizning profilga mos ish o'rinlari topilmadi. Profilni yangilang."
        });
      } else {
        toast.success(`${matches.length} ta mos ish topildi!`, {
          description: "AI tahlili yakunlandi"
        });
      }
    } catch (error: any) {
      console.error("Find jobs error:", error);
      toast.error(error?.response?.data?.error || "Ish qidirishda xatolik yuz berdi");
    } finally {
      setIsFinding(false);
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
      
      setJobs(prevJobs => prevJobs.map(j =>
        j.id === jobId ? { ...j, alreadyApplied: true } : j
      ));
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Ariza yuborishda xatolik");
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-100 text-green-700 border-green-300";
    if (match >= 80) return "bg-blue-100 text-blue-700 border-blue-300";
    if (match >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Job Finder
          </h1>
          <p className="text-muted-foreground mt-2">
            AI yordamida sizning profilga eng mos ish o'rinlarini toping
          </p>
        </div>

        {/* Find Button Card */}
        <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">AI bilan ish topish</h2>
                <p className="text-muted-foreground max-w-md">
                  AI sizning profil, ko'nikmalar va tajribangizni tahlil qilib, 
                  eng mos keladigan ish o'rinlarini topadi
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={handleFindJobs}
                disabled={isFinding}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
              >
                {isFinding ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI qidiryapti...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Ish topishni boshlash
                  </>
                )}
              </Button>
              {!hasSearched && !isFinding && (
                <p className="text-sm text-muted-foreground">
                  Profilingizni to'ldiring va eng yaxshi natijalarga erishing
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Topilgan ish o'rinlari ({jobs.length})
              </h2>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                <Sparkles className="mr-2 h-4 w-4" />
                AI tahlili
              </Badge>
            </div>

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ish topilmadi</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Sizning profil va ko'nikmalaringizga mos ish o'rinlari topilmadi.
                  </p>
                  <Button variant="outline" onClick={handleFindJobs}>
                    Qayta qidirish
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Job Info */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-xl font-semibold">{job.title}</h3>
                                <Badge className={getMatchColor(job.matchScore)}>
                                  {job.matchScore}% moslik
                                </Badge>
                                {job.urgent && (
                                  <Badge className="bg-red-100 text-red-700">
                                    Tez
                                  </Badge>
                                )}
                                {job.alreadyApplied && (
                                  <Badge className="bg-green-100 text-green-700">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Ariza yuborilgan
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
                                onClick={() => {
                                  const shareText = `${job.title} - ${job.company} | ${job.location}`;
                                  navigator.clipboard.writeText(shareText);
                                  toast.success("Nusxalandi!");
                                }}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Match Reason */}
                          {"matchReason" in job && job.matchReason && (
                            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                              <p className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2">
                                <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{job.matchReason}</span>
                              </p>
                            </div>
                          )}

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
                              <p className="text-sm font-medium mb-2">Talab qilinadigan ko'nikmalar:</p>
                              <div className="flex flex-wrap gap-1">
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
                            {job.alreadyApplied ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Ariza yuborilgan
                              </>
                            ) : (
                              "Ariza yuborish"
                            )}
                          </Button>
                          <Button variant="outline" asChild>
                            <a href={`/dashboard/vacancies/${job.id}`} target="_blank" rel="noopener noreferrer">
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
                ))}
              </div>
            )}

            {/* Stats */}
            {jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="flex items-center p-4">
                    <div className="rounded-full bg-green-100 p-2 mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{jobs.filter(j => j.matchScore >= 90).length}</p>
                      <p className="text-xs text-muted-foreground">Yuqori moslik (90%+)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-4">
                    <div className="rounded-full bg-blue-100 p-2 mr-3">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{jobs.filter(j => j.matchScore >= 80).length}</p>
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
                      <p className="text-xl font-bold">{jobs.filter(j => j.matchScore >= 70).length}</p>
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
                      <p className="text-xl font-bold">{jobs.length}</p>
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

