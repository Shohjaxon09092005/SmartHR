import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { applicationService, type Application } from "@/services/applications";
import { Loader2, Search, Filter, Calendar, MapPin, Building, Clock, Eye, Trash2, Download, Share2, ChevronDown, ChevronUp } from "lucide-react";

// Remove mock data - using API now

const statusFilters = [
  { value: "all", label: "Barchasi", count: 5 },
  { value: "applied", label: "Ariza yuborildi", count: 1 },
  { value: "review", label: "Ko'rib chiqilmoqda", count: 1 },
  { value: "interview", label: "Intervyu", count: 1 },
  { value: "accepted", label: "Qabul qilindi", count: 1 },
  { value: "rejected", label: "Rad etildi", count: 1 }
];

const getStatusColor = (status: string) => {
  const colors = {
    applied: "bg-blue-100 text-blue-700",
    review: "bg-yellow-100 text-yellow-700",
    interview: "bg-purple-100 text-purple-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
};

const getStatusProgress = (status: string) => {
  const progress = {
    applied: 25,
    review: 50,
    interview: 75,
    accepted: 100,
    rejected: 100
  };
  return progress[status as keyof typeof progress] || 0;
};

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  // Fetch applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationService.getAll();
      setApplications(data);
      setFilteredApplications(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Arizalarni yuklashda xatolik yuz berdi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter applications
  useEffect(() => {
    let result = applications;

    // Search filter
    if (searchTerm) {
      result = result.filter(app =>
        (app.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.company || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(result);
  }, [searchTerm, statusFilter, applications]);

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      await applicationService.delete(applicationId);
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      setFilteredApplications(prev => prev.filter(app => app.id !== applicationId));
      toast.success("Ariza muvaffaqiyatli bekor qilindi");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Arizani bekor qilishda xatolik yuz berdi";
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = (applicationId: string) => {
    if (expandedApplication === applicationId) {
      setExpandedApplication(null);
    } else {
      setExpandedApplication(applicationId);
    }
  };

  const handleDownloadDocuments = (application: any) => {
    toast.success(`"${application.jobTitle}" hujjatlari yuklab olindi`);
  };

  const handleShareApplication = (application: any) => {
    const shareText = `${application.jobTitle} - ${application.company} | Holati: ${application.statusText}`;
    if (navigator.share) {
      navigator.share({
        title: `Arizam: ${application.jobTitle}`,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Ariza ma'lumotlari nusxalandi!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString: string) => {
    const applied = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - applied.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} kun oldin`;
  };

  const stats = {
    total: applications.length,
    active: applications.filter(app => !['accepted', 'rejected'].includes(app.status)).length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Arizalarim
          </h1>
          <p className="text-muted-foreground mt-2">
            Barcha yuborgan arizalaringiz va ularning holatlari
          </p>
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
                <p className="text-sm text-muted-foreground">Jami arizalar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Faol arizalar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.accepted}</p>
                <p className="text-sm text-muted-foreground">Qabul qilingan</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <Filter className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rad etilgan</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-blue-600" />
              Arizalarni qidirish va filtrlash
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Search Input */}
              <div>
                <Label htmlFor="search">Ish nomi yoki kompaniya bo'yicha qidirish</Label>
                <Input
                  id="search"
                  placeholder="Ish nomi, kompaniya..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Status Filter */}
              <div>
                <Label htmlFor="status">Holat bo'yicha filtrlash</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statusFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label} ({filter.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {filteredApplications.length} ta ariza topildi
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrlarni tozalash
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Arizalar topilmadi</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Sizning qidiruv va filtrlaringizga mos arizalar topilmadi.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Barcha arizalarni ko'rsatish
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map(application => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Application Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {application.company.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-semibold">{application.jobTitle}</h3>
                              <div className="flex items-center text-muted-foreground mt-1">
                                <Building className="h-4 w-4 mr-1" />
                                <span className="font-medium">{application.company}</span>
                                <span className="mx-2">•</span>
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{application.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                {application.matchScore}% moslik
                              </Badge>
                              <Badge className={getStatusColor(application.status)}>
                                {application.statusText}
                              </Badge>
                            </div>
                          </div>

                          {/* Application Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Yuborilgan: {formatDate(application.appliedDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{getDaysAgo(application.appliedDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-2">Maosh:</span>
                              <span className="font-medium">{application.salary}</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Ariza holati</span>
                              <span>{getStatusProgress(application.status)}%</span>
                            </div>
                            <Progress value={getStatusProgress(application.status)} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(application.id)}
                        className="flex items-center justify-center"
                      >
                        {expandedApplication === application.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Yopish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Batafsil
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdrawApplication(application.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Bekor qilish
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedApplication === application.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Timeline */}
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Ariza jarayoni
                          </h4>
                          <div className="space-y-3">
                            {application.timeline.map((event, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  event.status === 'completed' ? 'bg-green-500' :
                                  event.status === 'current' ? 'bg-blue-500' :
                                  'bg-gray-300'
                                }`} />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <span className={`font-medium ${
                                      event.status === 'completed' ? 'text-green-700' :
                                      event.status === 'current' ? 'text-blue-700' :
                                      'text-gray-500'
                                    }`}>
                                      {event.event}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(event.date)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                          {/* Notes */}
                          {application.notes && (
                            <div>
                              <h4 className="font-semibold mb-2">Qo'shimcha ma'lumot</h4>
                              <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                                {application.notes}
                              </p>
                            </div>
                          )}

                          {/* Contact Information */}
                          {application.contactPerson && (
                            <div>
                              <h4 className="font-semibold mb-2">Aloqa</h4>
                              <div className="text-sm space-y-1">
                                <div>Aloqa shaxsi: {application.contactPerson}</div>
                                {application.contactEmail && (
                                  <div>Email: {application.contactEmail}</div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Offer Details */}
                          {application.offerDetails && (
                            <div>
                              <h4 className="font-semibold mb-2">Taklif tafsilotlari</h4>
                              <div className="text-sm space-y-2">
                                <div>Maosh: {application.offerDetails.salary}</div>
                                <div>Boshlash sanasi: {formatDate(application.offerDetails.startDate)}</div>
                                {application.offerDetails.benefits && (
                                  <div>
                                    Imtiyozlar:
                                    <ul className="list-disc list-inside mt-1">
                                      {application.offerDetails.benefits.map((benefit, idx) => (
                                        <li key={idx}>{benefit}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Rejection Reason */}
                          {application.rejectionReason && (
                            <div>
                              <h4 className="font-semibold mb-2 text-red-700">Rad etish sababi</h4>
                              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                {application.rejectionReason}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadDocuments(application)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Hujjatlar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShareApplication(application)}
                            >
                              <Share2 className="h-4 w-4 mr-1" />
                              Ulashish
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
              Arizalaringizni boshqarish uchun tezkor vositalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Download className="h-8 w-8 mb-2" />
                <span>Barcha arizalarni yuklab olish</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Calendar className="h-8 w-8 mb-2" />
                <span>Intervyular jadvali</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Building className="h-8 w-8 mb-2" />
                <span>Yangi ariza yuborish</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}