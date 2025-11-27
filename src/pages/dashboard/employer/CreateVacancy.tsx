import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { generateJobDescription } from "@/lib/aiClient";
import { vacancyService } from "@/services/vacancies";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Save, Plus, Trash2, Building, MapPin, DollarSign, Clock, Users, Award } from "lucide-react";

export default function CreateVacancy() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    company: "",
    location: "",
    workType: "full-time",
    remoteWork: false,
    
    // Salary and Experience
    salaryMin: "",
    salaryMax: "",
    salaryType: "monthly",
    experienceLevel: "mid-level",
    experienceYears: "",
    
    // Job Details
    category: "",
    skills: [] as string[],
    newSkill: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    
    // AI Generated Content
    description: "",
    
    // Additional Settings
    applicationDeadline: "",
    vacanciesCount: "1",
    urgent: false,
  });

  const workTypes = [
    { value: "full-time", label: "To'liq ish kuni" },
    { value: "part-time", label: "Qisman ish kuni" },
    { value: "contract", label: "Kontrakt" },
    { value: "remote", label: "Masofaviy" },
    { value: "internship", label: "Stajirovka" },
  ];

  const experienceLevels = [
    { value: "intern", label: "Stajyor" },
    { value: "junior", label: "Boshlang'ich" },
    { value: "mid-level", label: "O'rta" },
    { value: "senior", label: "Katta" },
    { value: "lead", label: "Lid" },
  ];

  const categories = [
    "Dasturlash",
    "Dizayn",
    "Marketing",
    "Sotuv",
    "Moliya",
    "HR",
    "Support",
    "Boshqaruv",
  ];

  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.newSkill.trim()],
        newSkill: ""
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleGenerateWithAI = async () => {
    if (!formData.title || !formData.requirements) {
      toast.error("Vakansiya nomi va asosiy talablarni kiriting!");
      return;
    }

    setIsGenerating(true);
    try {
      // Create comprehensive prompt for AI
      const prompt = `Create a professional job description in Uzbek language with the following details:

Job Title: ${formData.title}
Company: ${formData.company || "Our Company"}
Location: ${formData.location}
Work Type: ${workTypes.find(w => w.value === formData.workType)?.label}
Experience Level: ${experienceLevels.find(e => e.value === formData.experienceLevel)?.label}
Experience Years: ${formData.experienceYears || "Not specified"}
Required Skills: ${formData.skills.join(", ")}
Key Requirements: ${formData.requirements}
Salary Range: ${formData.salaryMin && formData.salaryMax ? `${formData.salaryMin}-${formData.salaryMax} ${formData.salaryType}` : "Competitive"}

Please create a comprehensive job description that includes:
1. Company overview
2. Job responsibilities
3. Required qualifications and skills
4. Preferred qualifications
5. What we offer
6. Application instructions

Format it professionally in Uzbek language.`;

      const generatedDesc = await generateJobDescription(formData.title, prompt);
      setFormData({ ...formData, description: generatedDesc });
      toast.success("AI orqali professional ish tavsifi yaratildi!");
    } catch (error) {
      toast.error("AI xizmatida xatolik yuz berdi");
      console.error("AI generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title || !formData.description || !formData.company || !formData.location) {
      toast.error("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    if (formData.salaryMin && formData.salaryMax && parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      toast.error("Minimal maosh maksimal maoshdan kichik bo'lishi kerak!");
      return;
    }

    setIsSaving(true);
    try {
      await vacancyService.create({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements || undefined,
        responsibilities: formData.responsibilities || undefined,
        benefits: formData.benefits || undefined,
        category: formData.category || undefined,
        workType: formData.workType,
        remoteWork: formData.remoteWork,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        salaryType: formData.salaryType || undefined,
        experienceLevel: formData.experienceLevel || undefined,
        experienceYears: formData.experienceYears || undefined,
        skills: formData.skills.length > 0 ? formData.skills : undefined,
        applicationDeadline: formData.applicationDeadline || undefined,
        vacanciesCount: formData.vacanciesCount ? parseInt(formData.vacanciesCount) : undefined,
        urgent: formData.urgent,
      });
      
      toast.success("Vakansiya muvaffaqiyatli saqlandi!");
      
      // Navigate to vacancies list
      navigate("/dashboard/vacancies");
    } catch (error: any) {
      toast.error(error.message || "Vakansiyani saqlashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const quickFillExample = () => {
    setFormData({
      ...formData,
      title: "Senior Frontend Developer",
      company: "TechCorp Uzbekistan",
      location: "Toshkent",
      workType: "full-time",
      experienceLevel: "senior",
      experienceYears: "5+",
      category: "Dasturlash",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      requirements: "5+ yil Frontend dasturlash tajribasi, React va TypeScript da kuchli bilim, Jamoa boshqaruv tajribasi",
      salaryMin: "2000",
      salaryMax: "3500",
    });
    toast.info("Namuna ma'lumotlar yuklandi. AI tugmasini bosing!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Yangi Vakansiya
            </h1>
            <p className="text-muted-foreground mt-2">
              Gemini AI yordamida professional ish tavsifi yarating
            </p>
          </div>
          <Button
            variant="outline"
            onClick={quickFillExample}
            className="mt-4 sm:mt-0"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Namuna ma'lumot
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Asosiy Ma'lumotlar
                </CardTitle>
                <CardDescription>
                  Vakansiya haqida asosiy ma'lumotlarni kiriting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Vakansiya nomi *</Label>
                    <Input
                      id="title"
                      placeholder="Misol: Frontend Developer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Kompaniya nomi *</Label>
                    <Input
                      id="company"
                      placeholder="Misol: TechCorp Uzbekistan"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Manzil *</Label>
                    <Input
                      id="location"
                      placeholder="Misol: Toshkent, Uzbekistan"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workType">Ish turi</Label>
                    <Select value={formData.workType} onValueChange={(value) => setFormData({ ...formData, workType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ish turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {workTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.remoteWork}
                    onCheckedChange={(checked) => setFormData({ ...formData, remoteWork: checked })}
                  />
                  <Label>Masofaviy ish imkoniyati</Label>
                </div>
              </CardContent>
            </Card>

            {/* Salary and Experience Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Maosh va Tajriba
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Minimal maosh ($)</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      placeholder="2000"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Maksimal maosh ($)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      placeholder="3500"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryType">Maosh turi</Label>
                    <Select value={formData.salaryType} onValueChange={(value) => setFormData({ ...formData, salaryType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Oylik</SelectItem>
                        <SelectItem value="yearly">Yillik</SelectItem>
                        <SelectItem value="hourly">Soatlik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Tajriba darajasi</Label>
                    <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">Tajriba yillari</Label>
                    <Input
                      id="experienceYears"
                      placeholder="Misol: 3-5 yil"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills and Requirements Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-600" />
                  Ko'nikmalar va Talablar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategoriya</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriya tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kerakli ko'nikmalar</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Yangi ko'nikma qo'shing"
                      value={formData.newSkill}
                      onChange={(e) => setFormData({ ...formData, newSkill: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Asosiy talablar (AI uchun) *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Misol: React va TypeScript da 3+ yil tajriba, Jamoa bilan ishlash ko'nikmasi, Agile metodologiyalari..."
                    className="min-h-[100px]"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Generation Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-600" />
                    AI yordamida Tavsif Yaratish
                  </span>
                  {formData.description && (
                    <Badge className="bg-green-100 text-green-700">
                      AI yaratildi
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Yuqoridagi ma'lumotlar asosida AI professional ish tavsifini yaratadi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || !formData.title || !formData.requirements}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI tavsif yaratyapti...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Gemini AI bilan Tavsif Yaratish
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="description">To'liq ish tavsifi *</Label>
                  <Textarea
                    id="description"
                    placeholder="AI tomonidan yaratilgan yoki qo'lda yoziladigan to'liq ish tavsifi..."
                    className="min-h-[300px] font-mono text-sm"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Qo'shimcha Sozlamalar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Ariza muddati</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vacanciesCount">Vakansiyalar soni</Label>
                    <Input
                      id="vacanciesCount"
                      type="number"
                      min="1"
                      value={formData.vacanciesCount}
                      onChange={(e) => setFormData({ ...formData, vacanciesCount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.urgent}
                    onCheckedChange={(checked) => setFormData({ ...formData, urgent: checked })}
                  />
                  <Label className="flex items-center">
                    <span>Shoshilinch vakansiya</span>
                    <Badge variant="destructive" className="ml-2">
                      Tez
                    </Badge>
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.title || !formData.description || !formData.company || !formData.location}
              className="w-full"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Vakansiyani Nashr Qilish
                </>
              )}
            </Button>
          </div>

          {/* AI Info and Tips Sidebar */}
          <div className="space-y-6">
            <Card className="h-fit">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI Yordamchi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-lg bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white">
                  <h3 className="font-semibold mb-3">Qanday Ishlaydi?</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-center">1. Asosiy ma'lumotlarni kiriting</li>
                    <li className="flex items-center">2. Talablar va ko'nikmalarni belgilang</li>
                    <li className="flex items-center">3. AI professional tavsif yaratadi</li>
                    <li className="flex items-center">4. Kerak bo'lsa tahrirlang va saqlang</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center">
                    <Award className="mr-2 h-4 w-4" />
                    AI Nima Qo'shadi?
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">✓ Professional formatda tavsif</li>
                    <li className="flex items-center">✓ To'liq mas'uliyatlar ro'yxati</li>
                    <li className="flex items-center">✓ Aniq talablar va malakalar</li>
                    <li className="flex items-center">✓ Kompaniya haqida ma'lumot</li>
                    <li className="flex items-center">✓ Nomzodlarni jalb qiluvchi matn</li>
                    <li className="flex items-center">✓ Takliflar va imtiyozlar</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <h4 className="font-semibold text-sm mb-2 text-blue-700">Maslahatlar</h4>
                  <ul className="space-y-1 text-xs text-blue-600">
                    <li>• Qanchalik batafsil ma'lumot bersangiz, AI shuncha yaxshi natija beradi</li>
                    <li>• Ko'nikmalarni aniq va real belgilang</li>
                    <li>• Maosh oralig'ini ochiq ko'rsating</li>
                    <li>• Talablarni darajalarga ajrating (majburiy, istalgan)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Preview Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Vakansiya Statistikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To'ldirilgan maydonlar:</span>
                  <span className="font-semibold">
                    {[
                      formData.title,
                      formData.company,
                      formData.location,
                      formData.description,
                      formData.requirements
                    ].filter(Boolean).length}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Belgilangan ko'nikmalar:</span>
                  <span className="font-semibold">{formData.skills.length} ta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ish turi:</span>
                  <span className="font-semibold">
                    {workTypes.find(w => w.value === formData.workType)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tajriba darajasi:</span>
                  <span className="font-semibold">
                    {experienceLevels.find(e => e.value === formData.experienceLevel)?.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}                                                                                                                                                                                                                                                                                                                                                                         