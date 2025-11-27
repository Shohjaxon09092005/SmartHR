import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  User, Mail, Phone, MapPin, Calendar, Edit, Save, Upload, 
  Download, Eye, Share2, Award, Briefcase, GraduationCap, 
  Languages, Globe, Github, Linkedin, Twitter, Shield,
  Bell, Lock, Trash2, Star, CheckCircle, Zap
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user data
  const [userData, setUserData] = useState({
    personal: {
      firstName: "Alisher",
      lastName: "Karimov",
      email: "alisher@example.com",
      phone: "+998 90 123 45 67",
      location: "Toshkent, Uzbekistan",
      birthDate: "1995-03-15",
      bio: "Senior Frontend Developer with 5+ years of experience in React and TypeScript. Passionate about building modern web applications.",
      avatar: "/api/placeholder/120/120"
    },
    professional: {
      title: "Senior Frontend Developer",
      experience: "5 years",
      currentCompany: "TechCorp Uzbekistan",
      skills: [
        { name: "React", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Next.js", level: 85 },
        { name: "Node.js", level: 75 },
        { name: "Tailwind CSS", level: 88 },
        { name: "GraphQL", level: 70 }
      ],
      resume: "AI tomonidan yaratilgan professional resume matni...",
      resumeScore: 87
    },
    education: [
      {
        degree: "Bachelor of Computer Science",
        institution: "Toshkent Axborot Texnologiyalari Universiteti",
        period: "2014-2018",
        description: "Computer Science yo'nalishi, GPA: 4.8/5.0"
      },
      {
        degree: "Frontend Development Bootcamp",
        institution: "Tech Education Center",
        period: "2019",
        description: "6 oylik intensiv kurs"
      }
    ],
    experience: [
      {
        position: "Senior Frontend Developer",
        company: "TechCorp Uzbekistan",
        period: "2021 - Hozirgacha",
        description: "React va TypeScript asosida modern web ilovalarini yaratish. Jamoa boshqaruv va kod review."
      },
      {
        position: "Frontend Developer",
        company: "Digital Solutions",
        period: "2019 - 2021",
        description: "JavaScript va React framework larida ishlash. 10+ loyihada ishtirok."
      },
      {
        position: "Frontend Intern",
        company: "StartUp Ventures",
        period: "2018 - 2019",
        description: "HTML, CSS, JavaScript asoslarini o'rganish va amaliy loyihalar."
      }
    ],
    portfolio: [
      {
        title: "E-commerce Platform",
        description: "React va Node.js da yaratilgan to'liq funksional online do'kon",
        link: "https://github.com/alisher/ecommerce",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"]
      },
      {
        title: "Task Management App",
        description: "Real-time vazifalar boshqaruv ilovasi",
        link: "https://github.com/alisher/taskapp",
        technologies: ["Next.js", "Socket.io", "PostgreSQL"]
      }
    ],
    social: {
      github: "alisher",
      linkedin: "alisher-karimov",
      twitter: "alisher_dev",
      website: "https://alisher.dev"
    },
    settings: {
      emailNotifications: true,
      jobAlerts: true,
      twoFactorAuth: false,
      privacy: "public"
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profil muvaffaqiyatli yangilandi!");
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Bu yerda haqiqiy fayl yuklash logikasi bo'ladi
      toast.success("Profil rasmi yangilandi!");
    }
  };

  const handleDownloadResume = () => {
    toast.success("Resume yuklab olindi!");
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/alisher`;
    if (navigator.share) {
      navigator.share({
        title: `${userData.personal.firstName} ${userData.personal.lastName} - Profil`,
        text: userData.personal.bio,
        url: profileUrl,
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profil havolasi nusxalandi!");
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Hisobingizni o'chirishni istaysizmi? Bu harakatni ortga qaytarib bo'lmaydi.")) {
      toast.error("Hisob o'chirildi");
    }
  };

  const profileCompletion = 85; // Calculate based on filled fields

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Profil
            </h1>
            <p className="text-muted-foreground mt-2">
              Shaxsiy ma'lumotlaringizni boshqaring va profilingizni yangilang
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={handleShareProfile}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Ulashish
            </Button>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Saqlash
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Tahrirlash
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Profile Completion */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Profil to'liqligi</span>
              </div>
              <span className="text-sm font-medium">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Profilingizni 100% to'liq holga keltiring va ish topish imkoniyatingizni oshiring
            </p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Shaxsiy
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Ijtimoiy
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Sozlamalar
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Avatar and Basic Info */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Profil Rasmi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <img
                        src={userData.personal.avatar}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">
                        {userData.personal.firstName} {userData.personal.lastName}
                      </h3>
                      <p className="text-muted-foreground">{userData.professional.title}</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Profil ko'rilgan</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Arizalar</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Intervyular</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Shaxsiy Ma'lumotlar</CardTitle>
                  <CardDescription>
                    Asosiy shaxsiy ma'lumotlaringiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ism</Label>
                      <Input
                        id="firstName"
                        value={userData.personal.firstName}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, firstName: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Familiya</Label>
                      <Input
                        id="lastName"
                        value={userData.personal.lastName}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, lastName: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.personal.email}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Telefon
                    </Label>
                    <Input
                      id="phone"
                      value={userData.personal.phone}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Manzil
                    </Label>
                    <Input
                      id="location"
                      value={userData.personal.location}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Tug'ilgan sana
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={userData.personal.birthDate}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, birthDate: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userData.personal.bio}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, bio: e.target.value }
                      }))}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Professional Information Tab */}
          <TabsContent value="professional" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Resume Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Resume</span>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-700">
                        {userData.professional.resumeScore}% Sifat
                      </Badge>
                      <Button variant="outline" size="sm" onClick={handleDownloadResume}>
                        <Download className="h-4 w-4 mr-1" />
                        Yuklab olish
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    AI yordamida yaratilgan professional resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {userData.professional.resume}
                    </pre>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ko'rish
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      AI bilan yangilash
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Ko'nikmalar</CardTitle>
                  <CardDescription>
                    Texnik va professional ko'nikmalaringiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.professional.skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm" className="w-full">
                      + Yangi ko'nikma qo'shish
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Experience and Education */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Tajriba
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-4 pb-4 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{exp.position}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <Badge variant="outline">{exp.period}</Badge>
                      </div>
                      <p className="text-sm mt-2">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Ta'lim
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-green-500 pl-4 pb-4 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        </div>
                        <Badge variant="outline">{edu.period}</Badge>
                      </div>
                      <p className="text-sm mt-2">{edu.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Loyihalar</CardTitle>
                <CardDescription>
                  Bajargan loyihalaringiz va ishlaringiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {userData.portfolio.map((project, index) => (
                    <Card key={index} className="relative">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-1" />
                            Kodni ko'rish
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button className="mt-4" variant="outline">
                  + Yangi loyiha qo'shish
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ijtimoiy Tarmoqlar</CardTitle>
                <CardDescription>
                  Profilingizni ijtimoiy tarmoqlar bilan bog'lang
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    value={userData.social.github}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      social: { ...prev.social, github: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={userData.social.linkedin}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      social: { ...prev.social, linkedin: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={userData.social.twitter}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      social: { ...prev.social, twitter: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Shaxsiy vebsayt
                  </Label>
                  <Input
                    id="website"
                    value={userData.social.website}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      social: { ...prev.social, website: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Bildirishnomalar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email bildirishnomalari</Label>
                      <p className="text-sm text-muted-foreground">
                        Yangiliklar va yangiliklardan xabardor bo'ling
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={userData.settings.emailNotifications}
                      onCheckedChange={(checked) => setUserData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, emailNotifications: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="job-alerts">Ish ogohlantirishlari</Label>
                      <p className="text-sm text-muted-foreground">
                        Sizga mos keladigan yangi ish o'rinlari haqida xabardor bo'ling
                      </p>
                    </div>
                    <Switch
                      id="job-alerts"
                      checked={userData.settings.jobAlerts}
                      onCheckedChange={(checked) => setUserData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, jobAlerts: checked }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Xavfsizlik
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Ikki faktorli autentifikatsiya</Label>
                      <p className="text-sm text-muted-foreground">
                        Hisobingizni qo'shimcha himoya qiling
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={userData.settings.twoFactorAuth}
                      onCheckedChange={(checked) => setUserData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, twoFactorAuth: checked }
                      }))}
                    />
                  </div>

                  <Button variant="outline" className="w-full">
                    Parolni yangilash
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Xavfli Sozlamalar
                </CardTitle>
                <CardDescription>
                  Ushbu amallarni bajarishni ortga qaytarib bo'lmaydi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-semibold text-red-800">Hisobni o'chirish</h4>
                    <p className="text-sm text-red-600">
                      Barcha ma'lumotlaringiz butunlay o'chiriladi
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hisobni o'chirish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}