import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Send, CheckCircle, Clock, Eye, TrendingUp, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { jobService, type JobMatch } from "@/services/jobs";
import { applicationService, type Application } from "@/services/applications";
import { Loader2 } from "lucide-react";
import { toast as sonnerToast } from "sonner";

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [jobsData, applicationsData] = await Promise.all([
        jobService.getMatches(),
        applicationService.getAll(),
      ]);
      
      // Get top 4 matched jobs
      setJobs(jobsData.slice(0, 4));
      // Get recent 4 applications
      setApplications(applicationsData.slice(0, 4));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ma'lumotlarni yuklashda xatolik";
      sonnerToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Ariza yuborish funksiyasi
  const handleApply = async (jobId: string) => {
    setIsApplying(true);
    setSelectedJob(jobId);
    
    try {
      await applicationService.create(jobId);
      sonnerToast.success("Ariza muvaffaqiyatli yuborildi!");
      
      // Reload data
      await loadDashboardData();
      
      setIsApplying(false);
      setSelectedJob(null);
    } catch (error: unknown) {
      console.error("Ariza yuborishda xatolik:", error);
      const errorMessage = error instanceof Error ? error.message : "Ariza yuborishda xatolik yuz berdi";
      sonnerToast.error(errorMessage);
      setIsApplying(false);
      setSelectedJob(null);
    }
  };

  // Removed unused AI functions - will be implemented later if needed

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Ish izlovchi paneli</h1>
          <p className="text-muted-foreground">AI yordamida ish qidiruv jarayoningiz</p>
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
                title="Mos ishlar"
                value={jobs.length > 0 ? jobs.length.toString() : "0"}
                change={`${jobs.filter(j => j.matchScore >= 90).length} ta yuqori moslik`}
                icon={Briefcase}
                trend={jobs.length > 0 ? "up" : undefined}
              />
              <StatsCard
                title="Yuborilgan arizalar"
                value={applications.length.toString()}
                change={`${applications.filter(app => ['pending', 'review'].includes(app.status)).length} ta ko'rilmoqda`}
                icon={Send}
                trend="up"
              />
              <StatsCard
                title="Ko'rib chiqilmoqda"
                value={applications.filter(app => ['pending', 'review'].includes(app.status)).length.toString()}
                change={`${applications.filter(app => app.status === 'review').length} ta ko'rilmoqda`}
                icon={Clock}
              />
              <StatsCard
                title="Qabul qilingan"
                value={applications.filter(app => app.status === "accepted").length.toString()}
                change={`${applications.filter(app => app.status === 'interview').length} ta intervyu`}
                icon={CheckCircle}
                trend={applications.filter(app => app.status === "accepted").length > 0 ? "up" : undefined}
              />
            </div>

            {/* Matching Jobs with AI Score */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sizga mos ishlar (AI Match)</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/job-matches")}
                  >
                    Barchasini ko'rish
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Mos ishlar topilmadi. Resume yarating yoki yangilab ko'ring.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vakansiya</TableHead>
                        <TableHead>Kompaniya</TableHead>
                        <TableHead>Joylashuv</TableHead>
                        <TableHead>AI Match Score</TableHead>
                        <TableHead className="text-right">Harakatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="mr-2 h-2 w-24 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                                  style={{ width: `${job.matchScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{job.matchScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => navigate(`/dashboard/job-matches`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleApply(job.id)}
                                disabled={isApplying && selectedJob === job.id || job.alreadyApplied}
                              >
                                {isApplying && selectedJob === job.id ? (
                                  "Yuborilmoqda..."
                                ) : job.alreadyApplied ? (
                                  "Ariza yuborilgan"
                                ) : (
                                  "Ariza yuborish"
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

        {/* Applications Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Arizalarim</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/applications")}
                  >
                    Barchasini ko'rish
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Hozircha arizalar mavjud emas. Ish topib ariza yuboring.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vakansiya</TableHead>
                        <TableHead>Kompaniya</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sana</TableHead>
                        <TableHead className="text-right">Harakatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.jobTitle || "Noma'lum"}</TableCell>
                          <TableCell>{app.company || "Noma'lum"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                app.status === "accepted"
                                  ? "default"
                                  : app.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {app.status === "accepted"
                                ? "Qabul qilindi"
                                : app.status === "rejected"
                                ? "Rad etildi"
                                : app.status === "interview"
                                ? "Intervyu"
                                : app.status === "review"
                                ? "Ko'rilmoqda"
                                : "Kutilmoqda"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(app.appliedAt).toLocaleDateString('uz-UZ')}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => navigate(`/dashboard/applications`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* AI Tools Card */}
        {!isLoading && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                AI Resume Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sun'iy intellekt yordamida professional resume yarating
              </p>
              <Button
                className="w-full"
                onClick={() => navigate("/dashboard/resume-generator")}
              >
                Resume yaratish
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                AI CV Analyzer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                CV ni AI orqali tahlil qiling va tavsiyalar oling
              </p>
              <Button
                className="w-full"
                onClick={() => navigate("/dashboard/cv-analyzer")}
              >
                CV tahlil qilish
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center text-green-900">
                <MessageCircle className="mr-2 h-5 w-5" />
                AI Intervyu Simulyator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 mb-4">
                Real intervyu sharoitida mashq qiling
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate("/dashboard/interview-simulator")}
              >
                Intervyu boshlash
              </Button>
            </CardContent>
          </Card>
        </div>
        )}
      </div>
    </DashboardLayout>
  );
}