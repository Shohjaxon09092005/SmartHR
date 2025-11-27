import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { analyzeResume } from "@/lib/aiClient";
import { Loader2, Sparkles, Upload, TrendingUp, Briefcase, Award, Star, FileText, Zap, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

// Dynamic import for PDF and DOCX parsing
const loadPdfParse = async () => {
  const module = await import('pdf-parse');
  return module.default;
};

const loadMammoth = async () => {
  const module = await import('mammoth');
  return module.default;
};

export default function CVAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<{
    skills: string[];
    experience: string;
    recommendations: string[];
  } | null>(null);

  // PDF faylni o'qish
  const readPDFFile = async (file: File): Promise<string> => {
    try {
      const pdfParse = await loadPdfParse();
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      const result = await pdfParse(pdfData);
      return result.text;
    } catch (error) {
      console.error("PDF o'qish xatosi:", error);
      throw new Error("PDF faylni o'qib bo'lmadi");
    }
  };

  // DOCX faylni o'qish
  const readDOCXFile = async (file: File): Promise<string> => {
    try {
      const mammoth = await loadMammoth();
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("DOCX o'qish xatosi:", error);
      throw new Error("DOCX faylni o'qib bo'lmadi");
    }
  };

  // Text faylni o'qish
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Fayl yuklash funksiyasi
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Fayl turini tekshirish
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
      toast.error("Faqat PDF, DOCX va TXT fayllarni yuklash mumkin!");
      return;
    }

    // Fayl hajmini tekshirish (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fayl hajmi 5MB dan kichik bo'lishi kerak!");
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      let text = "";
      
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await readPDFFile(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        text = await readDOCXFile(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await readTextFile(file);
      } else {
        // Fallback to text
        text = await readTextFile(file);
      }

      // Matnni tozalash
      const cleanedText = text
        .replace(/\n\s*\n/g, '\n') // Qo'shimcha yangi qatorlarni olib tashlash
        .replace(/[^\S\n]+/g, ' ') // Qo'shimcha bo'shliqlarni olib tashlash
        .trim();

      setResumeText(cleanedText);
      toast.success(`Fayl muvaffaqiyatli yuklandi: ${file.name}`);
    } catch (error) {
      console.error("Fayl o'qish xatosi:", error);
      toast.error("Faylni o'qishda xatolik yuz berdi");
      setFileName("");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error("CV matnini kiriting yoki fayl yuklang!");
      return;
    }

    if (resumeText.length < 50) {
      toast.error("CV matni juda qisqa! Kamida 50 ta belgi kiriting.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeText);
      setAnalysis(result);
      toast.success("CV muvaffaqiyatli tahlil qilindi!");
    } catch (error) {
      console.error("Tahlil xatosi:", error);
      toast.error("AI tahlil qilishda xatolik yuz berdi");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setResumeText("");
    setFileName("");
    toast.info("Tahlil tozalandi!");
  };

  const removeFile = () => {
    setFileName("");
    setResumeText("");
    toast.info("Fayl olib tashlandi");
  };

  const handleExampleCV = () => {
    const exampleCV = `ALISHER KARIMOV
Frontend Developer

KONTAKT:
• Email: alisher@example.com
• Telefon: +998 90 123 45 67
• LinkedIn: linkedin.com/in/alisher

TAJRIBA:
Frontend Developer - TechCorp (2022-2024)
• React va TypeScript da 10+ loyiha
• Jamoa boshqaruv va kod review
• Performance optimizatsiya

Frontend Intern - StartUp (2021-2022)
• JavaScript, HTML, CSS
• Responsive design loyihalari

KO'NIKMALAR:
Texnik: JavaScript, React, TypeScript, Node.js, Git
Framework: Next.js, Redux, Tailwind CSS
Soft: Jamoa ishi, Muammo yechish, Agile

TA'LIM:
Toshkent Axborot Texnologiyalari Universiteti
Computer Science Bakalavr (2018-2022)`;

    setResumeText(exampleCV);
    setFileName("namuna-cv.txt");
    toast.info("Namuna CV yuklandi. Tahlil qilish uchun tugmani bosing.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            AI CV Analyzer
          </h1>
          <p className="text-muted-foreground mt-2">
            Google Gemini AI yordamida CV ni tahlil qiling va professional tavsiyalar oling
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Form */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                CV ni yuklang yoki kiriting
              </CardTitle>
              <CardDescription>
                PDF, DOCX yoki TXT fayl yuklang yoki matnni to'g'ridan-to'g'ri kiriting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-green-500 bg-green-50'
                      : 'border-green-200 bg-green-50 hover:bg-green-100'
                  }`}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-3" />
                      <p className="text-green-700 font-medium">Fayl yuklanmoqda...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mx-auto mb-3 text-green-600" />
                      <h3 className="font-semibold mb-2 text-green-700">
                        {isDragActive ? "Faylni bu erga tashlang" : "CV faylini yuklang"}
                      </h3>
                      <p className="text-sm text-green-600 mb-4">
                        PDF, DOCX yoki TXT format (maksimum 5MB)
                      </p>
                      <Button type="button" variant="outline" className="border-green-300 text-green-700">
                        <Upload className="mr-2 h-4 w-4" />
                        Fayl tanlash
                      </Button>
                    </>
                  )}
                </div>

                {/* Uploaded File Info */}
                {fileName && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">{fileName}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {fileName.endsWith('.pdf') ? 'PDF' : 
                         fileName.endsWith('.docx') ? 'DOCX' : 'TXT'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Yoki matn kiriting
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="resumeText" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    CV matni *
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExampleCV}
                    className="text-blue-600 border-blue-200"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Namuna CV
                  </Button>
                </div>
                <Textarea
                  id="resumeText"
                  placeholder="CV matnini bu yerga kiriting yoki yuqoridan fayl yuklang..."
                  className="min-h-[200px] font-mono text-sm"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimal 50 ta belgi</span>
                  <span>{resumeText.length} / 3000 belgi</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !resumeText.trim() || resumeText.length < 50}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI tahlil qilyapti...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      CV ni Tahlil Qilish
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={clearAnalysis}
                  variant="outline"
                  size="lg"
                >
                  Tozalash
                </Button>
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-xl font-bold flex items-center text-green-700">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Tahlil Natijalari
                  </h3>

                  {/* Skills */}
                  <Card className="border-green-200">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-base flex items-center text-green-700">
                        <Award className="mr-2 h-4 w-4" />
                        Aniqlangan Ko'nikmalar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex flex-wrap gap-2">
                        {analysis.skills.map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Experience */}
                  <Card className="border-blue-200">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-base flex items-center text-blue-700">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Tajriba Darajasi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <p className="text-muted-foreground font-medium">{analysis.experience}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="border-purple-200">
                    <CardHeader className="bg-purple-50">
                      <CardTitle className="text-base flex items-center text-purple-700">
                        <Star className="mr-2 h-4 w-4" />
                        Taklif va Tavsiyalar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-3">
                        {analysis.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-start text-sm p-3 bg-purple-50 rounded-lg border border-purple-100"
                          >
                            <span className="mr-3 text-purple-600 font-bold mt-0.5">{index + 1}.</span>
                            <span className="text-purple-800">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(resumeText);
                        toast.success("CV matni nusxalandi!");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      CV ni Nusxalash
                    </Button>
                    <Button
                      onClick={clearAnalysis}
                      variant="outline"
                      className="flex-1"
                    >
                      Yangi Tahlil
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Info Card */}
          <div className="space-y-6">
            <Card className="border-2 border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI CV Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-lg bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white">
                  <h3 className="font-semibold mb-3">Qo'llab-quvvatlanadigan Formatlar</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">✓ PDF fayllar</li>
                    <li className="flex items-center">✓ DOCX fayllar</li>
                    <li className="flex items-center">✓ TXT fayllar</li>
                    <li className="flex items-center">✓ To'g'ridan-to'g'ri matn</li>
                    <li className="flex items-center">✓ Maksimum 5MB</li>
                    <li className="flex items-center">✓ Google Gemini AI</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Qanday Ishlaydi?
                  </h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">1</span>
                      Fayl yuklang yoki matn kiriting
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">2</span>
                      AI faylni o'qiydi va tahlil qiladi
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">3</span>
                      Batafsil hisobot tayyorlanadi
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">4</span>
                      Tavsiyalar bilan tanishing
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Award className="mr-2 h-4 w-4" />
                  Professional Maslahatlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>Aniq va to'liq CV fayl yuklang</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>PDF formatida yuklash tavsiya etiladi</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>Matn aniq ko'rinadigan fayllarni tanlang</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                  <p>Skann qilingan PDF lar ham qo'llab-quvvatlanadi</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}