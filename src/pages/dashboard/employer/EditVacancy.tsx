import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Loader2, Sparkles, Save, ArrowLeft, Building, MapPin, DollarSign, Clock, Award } from "lucide-react";

// Mock data - aslida API dan olinadi
const mockVacancyData = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp Uzbekistan",
  location: "Toshkent",
  workType: "full-time",
  remoteWork: false,
  salaryMin: "2000",
  salaryMax: "3500",
  salaryType: "monthly",
  experienceLevel: "senior",
  experienceYears: "5+",
  category: "Dasturlash",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  requirements: "5+ yil Frontend dasturlash tajribasi, React va TypeScript da kuchli bilim, Jamoa boshqaruv tajribasi",
  responsibilities: "",
  benefits: "",
  description: "Biz tajribali Frontend Dasturchi izlayapmiz...",
  applicationDeadline: "2024-02-15",
  vacanciesCount: "1",
  urgent: true,
  status: "active"
};

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

export default function EditVacancy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    workType: "full-time",
    remoteWork: false,
    salaryMin: "",
    salaryMax: "",
    salaryType: "monthly",
    experienceLevel: "mid-level",
    experienceYears: "",
    category: "",
    skills: [] as string[],
    newSkill: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    description: "",
    applicationDeadline: "",
    vacanciesCount: "1",
    urgent: false,
  });

  // Vakansiya ma'lumotlarini yuklash
  useEffect(() => {
    // Bu yerda API dan ma'lumot olish kerak
    // Hozircha mock data ishlatamiz
    const vacancy = mockVacancyData;
    
    setFormData({
      title: vacancy.title,
      company: vacancy.company,
      location: vacancy.location,
      workType: vacancy.workType,
      remoteWork: vacancy.remoteWork,
      salaryMin: vacancy.salaryMin,
      salaryMax: vacancy.salaryMax,
      salaryType: vacancy.salaryType,
      experienceLevel: vacancy.experienceLevel,
      experienceYears: vacancy.experienceYears,
      category: vacancy.category,
      skills: vacancy.skills,
      newSkill: "",
      requirements: vacancy.requirements,
      responsibilities: vacancy.responsibilities,
      benefits: vacancy.benefits,
      description: vacancy.description,
      applicationDeadline: vacancy.applicationDeadline,
      vacanciesCount: vacancy.vacanciesCount,
      urgent: vacancy.urgent,
    });

    toast.success("Vakansiya ma'lumotlari yuklandi");
  }, [id]);

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
      const prompt = `Update job description in Uzbek language with the following details:

Job Title: ${formData.title}
Company: ${formData.company}
Location: ${formData.location}
Work Type: ${workTypes.find(w => w.value === formData.workType)?.label}
Experience Level: ${experienceLevels.find(e => e.value === formData.experienceLevel)?.label}
Experience Years: ${formData.experienceYears}
Required Skills: ${formData.skills.join(", ")}
Key Requirements: ${formData.requirements}
Salary Range: ${formData.salaryMin && formData.salaryMax ? `${formData.salaryMin}-${formData.salaryMax} ${formData.salaryType}` : "Competitive"}

Please update the job description to be more professional and appealing.`;

      const generatedDesc = await generateJobDescription(formData.title, prompt);
      setFormData({ ...formData, description: generatedDesc });
      toast.success("AI orqali tavsif yangilandi!");
    } catch (error) {
      toast.error("AI xizmatida xatolik yuz berdi");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.company || !formData.location) {
      toast.error("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    setIsSaving(true);
    try {
      // API ga saqlash logikasi
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Vakansiya muvaffaqiyatli yangilandi!");
      navigate("/dashboard/vacancies");
    } catch (error) {
      toast.error("Vakansiyani yangilashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/vacancies")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Vakansiyani Tahrirlash
              </h1>
              <p className="text-muted-foreground mt-2">
                Vakansiya ma'lumotlarini yangilang
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="mt-4 sm:mt-0">
            ID: {id}
          </Badge>
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Vakansiya nomi *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Kompaniya nomi *</Label>
                    <Input
                      id="company"
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
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workType">Ish turi</Label>
                    <Select value={formData.workType} onValueChange={(value) => setFormData({ ...formData, workType: value })}>
                      <SelectTrigger>
                        <SelectValue />
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
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Maksimal maosh ($)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
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
                      Qo'shish
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
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Asosiy talablar *</Label>
                  <Textarea
                    id="requirements"
                    className="min-h-[100px]"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-600" />
                    Ish Tavsifi
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateWithAI}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    AI bilan Yangilash
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">To'liq ish tavsifi *</Label>
                  <Textarea
                    id="description"
                    className="min-h-[300px]"
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
              disabled={isSaving}
              className="w-full"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yangilanmoqda...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Yangilashni Saqlash
                </>
              )}
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="h-fit">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle>Tahrirlash Rejimi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
                  <h4 className="font-semibold mb-2 text-orange-700">Diqqat!</h4>
                  <ul className="space-y-1 text-sm text-orange-600">
                    <li>• Vakansiyani yangilaganingizda, barcha nomzodlar xabardor bo'lishadi</li>
                    <li>• Majburiy maydonlar to'ldirilishi shart</li>
                    <li>• O'zgarishlarni saqlaganingizda vakansiya qayta ko'rib chiqiladi</li>
                  </ul>
                </div>

                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Tezkor Amallar</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      Vakansiyani Nusxalash
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      Oldingi Versiyalar
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600" size="sm">
                      Vakansiyani O'chirish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}