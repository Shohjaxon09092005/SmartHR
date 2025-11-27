import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, CheckCircle, Clock, Eye, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { vacancyService, type Vacancy } from "@/services/vacancies";
import { applicationService, type Application } from "@/services/applications";
import { toast } from "sonner";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [vacanciesData, applicantsData] = await Promise.all([
        vacancyService.getAll({ status: "active" }),
        applicationService.getAll(),
      ]);
      
      // Filter vacancies for this employer (done by backend)
      setVacancies(vacanciesData.slice(0, 4));
      // Get recent applicants
      setApplicants(applicantsData.slice(0, 4));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ma'lumotlarni yuklashda xatolik";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      await applicationService.update(applicationId, { status: "accepted" });
      toast.success("Ariza tasdiqlandi!");
      await loadDashboardData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Tasdiqlashda xatolik";
      toast.error(errorMessage);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await applicationService.update(applicationId, { status: "rejected" });
      toast.success("Ariza rad etildi");
      await loadDashboardData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Rad etishda xatolik";
      toast.error(errorMessage);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ish beruvchi paneli</h1>
            <p className="text-muted-foreground">Vakansiyalar va nomzodlar boshqaruvi</p>
          </div>
          <Button onClick={() => navigate("/dashboard/create-vacancy")} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Yangi vakansiya
          </Button>
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
                title="Faol vakansiyalar"
                value={vacancies.length.toString()}
                change={`${vacancies.filter(v => v.status === 'active').length} ta faol`}
                icon={Briefcase}
                trend="up"
              />
              <StatsCard
                title="Jami nomzodlar"
                value={applicants.length.toString()}
                change={`${applicants.filter(a => ['pending', 'review'].includes(a.status)).length} ta ko'rilmoqda`}
                icon={Users}
                trend="up"
              />
              <StatsCard
                title="Ko'rib chiqilmoqda"
                value={applicants.filter(a => ['pending', 'review'].includes(a.status)).length.toString()}
                change={`${applicants.filter(a => a.status === 'review').length} ta ko'rilmoqda`}
                icon={Clock}
              />
              <StatsCard
                title="Tasdiqlangan"
                value={applicants.filter(a => a.status === "accepted").length.toString()}
                change={`${applicants.filter(a => a.status === 'interview').length} ta intervyu`}
                icon={CheckCircle}
                trend={applicants.filter(a => a.status === "accepted").length > 0 ? "up" : undefined}
              />
            </div>

            {/* Vacancies Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mening vakansiyalarim</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/vacancies")}
                  >
                    Barchasini ko'rish
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {vacancies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Vakansiyalar mavjud emas. Yangi vakansiya yarating.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vakansiya</TableHead>
                        <TableHead>Nomzodlar soni</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sana</TableHead>
                        <TableHead className="text-right">Harakatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vacancies.map((vacancy) => (
                        <TableRow key={vacancy.id}>
                          <TableCell className="font-medium">{vacancy.title}</TableCell>
                          <TableCell>{(vacancy as any).applicationCount || 0} ta</TableCell>
                          <TableCell>
                            <Badge
                              variant={vacancy.status === "active" ? "default" : "secondary"}
                            >
                              {vacancy.status === "active" ? "Faol" : vacancy.status === "closed" ? "Yopilgan" : "Kutilmoqda"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(vacancy.createdAt).toLocaleDateString('uz-UZ')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => navigate(`/dashboard/vacancies`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => navigate(`/dashboard/edit-vacancy/${vacancy.id}`)}
                              >
                                Tahrirlash
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

            {/* Applicants with AI Match Score */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Oxirgi nomzodlar (AI Match Score)</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/applicants")}
                  >
                    Barchasini ko'rish
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {applicants.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Hozircha nomzodlar mavjud emas.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nomzod</TableHead>
                        <TableHead>Vakansiya</TableHead>
                        <TableHead>AI Match Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Harakatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants.map((applicant) => (
                        <TableRow key={applicant.id}>
                          <TableCell className="font-medium">{applicant.jobSeekerName || "Noma'lum"}</TableCell>
                          <TableCell>{applicant.jobTitle || "Noma'lum"}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="mr-2 h-2 w-24 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                                  style={{ width: `${applicant.matchScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{applicant.matchScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                applicant.status === "accepted"
                                  ? "default"
                                  : applicant.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {applicant.status === "accepted" 
                                ? "Tasdiqlangan" 
                                : applicant.status === "rejected"
                                ? "Rad etilgan"
                                : applicant.status === "interview"
                                ? "Intervyu"
                                : "Kutilmoqda"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => navigate(`/dashboard/applicants`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {['pending', 'review'].includes(applicant.status) && (
                                <>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleApprove(applicant.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Tasdiqlash
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(applicant.id)}
                                  >
                                    Rad etish
                                  </Button>
                                </>
                              )}
                            </div>
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
      </div>
    </DashboardLayout>
  );
}
