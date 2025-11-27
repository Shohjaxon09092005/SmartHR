import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateResume } from "@/lib/aiClient";
import { Loader2, Sparkles, Download, Copy, User, Briefcase, GraduationCap, Wrench, BookOpen } from "lucide-react";

export default function ResumeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    skills: "",
    education: "",
  });
  const [generatedResume, setGeneratedResume] = useState("");

  const handleGenerate = async () => {
    if (!formData.name || !formData.experience || !formData.skills) {
      toast.error("Ism, tajriba va ko'nikmalarni kiriting!");
      return;
    }

    setIsGenerating(true);
    try {
      const resume = await generateResume(formData);
      
      // AI ning o'ziga xos matnlarini olib tashlash
      const cleanedResume = resume
        .replace(/^(Soha|Vazifa|Javob|Response|Analysis):.*?\n/gi, '')
        .replace(/```[\s\S]*?\n/g, '')
        .replace(/^["']|["']$/g, '')
        .trim();
      
      setGeneratedResume(cleanedResume);
      toast.success("Professional resume yaratildi!");
    } catch (error) {
      toast.error("AI xizmatida xatolik yuz berdi");
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResume);
    toast.success("Resume nusxalandi!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedResume], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.name.replace(/\s+/g, '_')}_resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Resume yuklab olindi!");
  };

  const clearForm = () => {
    setFormData({
      name: "",
      experience: "",
      skills: "",
      education: "",
    });
    setGeneratedResume("");
    toast.info("Forma tozalandi!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Resume Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            AI yordamida professional resume yarating - 100% professional format
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Form */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Shaxsiy ma'lumotlaringiz
              </CardTitle>
              <CardDescription>
                Ma'lumotlaringizni kiriting va AI sizga professional resume yaratadi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  To'liq ism *
                </Label>
                <Input
                  id="name"
                  placeholder="Misol: Alisher Karimov"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Ish tajribasi *
                </Label>
                <Textarea
                  id="experience"
                  placeholder="Misol: 
• Frontend Developer @ Tech Company (2020-2023)
• 3+ yil React va TypeScript bilan ishlash
• 10+ loyihada ishtirok
• Jamoa boshqaruv..."
                  className="min-h-[120px] border-blue-200 focus:border-blue-500"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Har bir ish joyi, lavozim, vaqt oraligi va vazifalarni yozing
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="flex items-center">
                  <Wrench className="mr-2 h-4 w-4" />
                  Ko'nikmalar *
                </Label>
                <Textarea
                  id="skills"
                  placeholder="Misol: 
JavaScript, React, TypeScript, Node.js, Git, Agile, Scrum
Redux, Next.js, MongoDB, PostgreSQL, Docker, AWS..."
                  className="min-h-[100px] border-blue-200 focus:border-blue-500"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Texnik va professional ko'nikmalaringizni vergul bilan ajrating
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education" className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Ta'lim
                </Label>
                <Textarea
                  id="education"
                  placeholder="Misol: 
• Bachelor's in Computer Science, TATU (2016-2020)
• GPA: 4.8/5.0
• Frontend Development Bootcamp (2020)"
                  className="min-h-[80px] border-blue-200 focus:border-blue-500"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !formData.name || !formData.experience || !formData.skills}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI resume yaratyapti...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Resume Yaratish
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={clearForm}
                  variant="outline"
                  size="lg"
                >
                  Tozalash
                </Button>
              </div>

              {generatedResume && (
                <div className="space-y-3 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Yaratilgan Resume</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Nusxalash
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Yuklab olish
                      </Button>
                    </div>
                  </div>
                  
                  <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <div className="whitespace-pre-wrap text-sm font-sans leading-relaxed bg-white p-4 rounded-lg border">
                        {generatedResume}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700 flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      <strong>Muvaffaqiyatli yaratildi!</strong> Resume ni nusxalang yoki yuklab oling.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Info Card */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI Resume Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                  <h3 className="font-semibold mb-3">Premium Xususiyatlar</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">✓ Professional formatda</li>
                    <li className="flex items-center">✓ ATS-friendly struktura</li>
                    <li className="flex items-center">✓ To'liq tuzilgan bo'limlar</li>
                    <li className="flex items-center">✓ 60 soniyada tayyor</li>
                    <li className="flex items-center">✓ Google Gemini AI</li>
                    <li className="flex items-center">✓ Hech qanday reklam yo'q</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Qanday ishlaydi?
                  </h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">1</span>
                      Ma'lumotlaringizni kiriting
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">2</span>
                      Gemini AI professional tahlil qiladi
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">3</span>
                      Optimallashtirilgan resume yaratadi
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">4</span>
                      Yuklab oling yoki nusxalang
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Professional Maslahatlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>Tajribangizni raqamlar bilan ko'rsating (3+ yil, 10+ loyiha)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>Ko'nikmalaringizni aniq va kategoriyalarga ajrating</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>Natijalarga e'tibor bering (loyihalar, mukofotlar)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>Har bir ish joyi uchun aniq vazifalarni yozing</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>Maxsus loyihalar va sertifikatlarni qo'shing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}