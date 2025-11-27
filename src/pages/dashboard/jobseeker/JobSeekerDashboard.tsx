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

// Mock data for jobs and applications
const initialJobs = [
  { id: "1", title: "Frontend Developer", company: "Tech Solutions", matchScore: 92, location: "Toshkent", description: "React va TypeScript bilen ishlash", requirements: ["React", "TypeScript", "HTML/CSS"] },
  { id: "2", title: "React Developer", company: "Digital Agency", matchScore: 88, location: "Samarqand", description: "Modern React dasturlari", requirements: ["React", "JavaScript", "Redux"] },
  { id: "3", title: "Full Stack Developer", company: "IT Company", matchScore: 85, location: "Toshkent", description: "Full stack rivojlanish", requirements: ["Node.js", "React", "MongoDB"] },
  { id: "4", title: "UI/UX Designer", company: "Creative Studio", matchScore: 79, location: "Buxoro", description: "Dizayn va prototiplash", requirements: ["Figma", "UI/UX", "Adobe Creative Suite"] },
];

const initialApplications = [
  { id: "1", title: "Frontend Developer", company: "Tech Solutions", status: "pending", date: "2025-11-20" },
  { id: "2", title: "Backend Developer", company: "Digital Agency", status: "approved", date: "2025-11-18" },
  { id: "3", title: "UI/UX Designer", company: "Creative Studio", status: "rejected", date: "2025-11-15" },
  { id: "4", title: "Project Manager", company: "Consulting Group", status: "pending", date: "2025-11-10" },
];

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Ariza yuborish funksiyasi
  const handleApply = async (job) => {
    setIsApplying(true);
    setSelectedJob(job);
    
    try {
      // AI yordamida ariza tayyorlash
      const applicationText = await generateApplicationWithAI(job);
      
      // Mock ariza yuborish
      setTimeout(() => {
        const newApplication = {
          id: (applications.length + 1).toString(),
          title: job.title,
          company: job.company,
          status: "pending",
          date: new Date().toISOString().split('T')[0]
        };
        
        setApplications(prev => [newApplication, ...prev]);
        setIsApplying(false);
        setSelectedJob(null);
        
        toast({
          title: "Ariza muvaffaqiyatli yuborildi!",
          description: `${job.title} pozitsiyasi uchun arizangiz qabul qilindi.`,
        });
      }, 2000);
      
    } catch (error) {
      console.error("Ariza yuborishda xatolik:", error);
      setIsApplying(false);
      toast({
        title: "Xatolik",
        description: "Ariza yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    }
  };

  // AI yordamida ariza matnini yaratish
  const generateApplicationWithAI = async (job) => {
    // Gemini API chaqiruvi
    // Haqiqiy loyihada API kalitingizni .env faylida saqlang
    const API_KEY = "YOUR_GEMINI_API_KEY";
    const prompt = `Quyidagi ish uchun ariza matnini yozing:
    
    Ish nomi: ${job.title}
    Kompaniya: ${job.company}
    Tavsif: ${job.description}
    Talablar: ${job.requirements.join(", ")}
    
    Professional va ishonchli ariza matnini yozing.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("AI yordamida ariza yaratishda xatolik:", error);
      return `${job.title} pozitsiyasi uchun arizam. Tajribam va ko'nikmalarim ushbu rolda muvaffaqiyatli ishlashim uchun mos keladi.`;
    }
  };

  // AI intervyu savollarini yaratish
  const generateInterviewQuestions = async (job) => {
    setIsGeneratingQuestions(true);
    
    try {
      const API_KEY = "YOUR_GEMINI_API_KEY";
      const prompt = `Quyidagi ish uchun 5 ta intervyu savolini yarating:
      
      Ish nomi: ${job.title}
      Tavsif: ${job.description}
      Talablar: ${job.requirements.join(", ")}
      
      Savollar o'rtacha darajada va texnik bo'lsin.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      const questionsText = data.candidates[0].content.parts[0].text;
      const questions = questionsText.split('\n').filter(q => q.trim().length > 0);
      
      setInterviewQuestions(questions);
      
      toast({
        title: "Intervyu savollari tayyor!",
        description: `${job.title} uchun ${questions.length} ta savol yaratildi.`,
      });
      
    } catch (error) {
      console.error("Savollar yaratishda xatolik:", error);
      toast({
        title: "Xatolik",
        description: "Savollar yaratishda xatolik yuz berdi.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Ish izlovchi paneli</h1>
          <p className="text-muted-foreground">AI yordamida ish qidiruv jarayoningiz</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Mos ishlar"
            value="24"
            change="+8 yangi"
            icon={Briefcase}
            trend="up"
          />
          <StatsCard
            title="Yuborilgan arizalar"
            value={applications.length.toString()}
            change="+4 bu hafta"
            icon={Send}
            trend="up"
          />
          <StatsCard
            title="Ko'rib chiqilmoqda"
            value={applications.filter(app => app.status === "pending").length.toString()}
            change="3 ta yangi"
            icon={Clock}
          />
          <StatsCard
            title="Qabul qilingan"
            value={applications.filter(app => app.status === "approved").length.toString()}
            change="+1 bu hafta"
            icon={CheckCircle}
            trend="up"
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
                          onClick={() => generateInterviewQuestions(job)}
                          disabled={isGeneratingQuestions}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleApply(job)}
                          disabled={isApplying && selectedJob?.id === job.id}
                        >
                          {isApplying && selectedJob?.id === job.id ? (
                            "Yuborilmoqda..."
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
          </CardContent>
        </Card>

        {/* Interview Questions Modal */}
        {interviewQuestions.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <MessageCircle className="mr-2 h-5 w-5" />
                AI Intervyu Savollari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {interviewQuestions.map((question, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm">{question}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button 
                  size="sm" 
                  onClick={() => setInterviewQuestions([])}
                  variant="outline"
                >
                  Yopish
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    // Intervyu mashqini boshlash
                    toast({
                      title: "Intervyu mashqi boshlandi!",
                      description: "Savollarga ovozli javob bering.",
                    });
                  }}
                >
                  Intervyuni boshlash
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <TableCell className="font-medium">{app.title}</TableCell>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === "approved"
                            ? "default"
                            : app.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {app.status === "approved"
                          ? "Qabul qilindi"
                          : app.status === "rejected"
                          ? "Rad etildi"
                          : "Ko'rilmoqda"}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.date}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/applications/${app.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AI Tools Card */}
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
      </div>
    </DashboardLayout>
  );
}