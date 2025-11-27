import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Play, 
  Pause, 
  SkipForward, 
  Star, 
  Brain, 
  Clock, 
  TrendingUp,
  User,
  FileText,
  Calendar,
  Target,
  Volume2,
  RotateCcw
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Type definitions
interface Question {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  tips: string[];
}

interface InterviewQuestions {
  [key: string]: Question[];
}

interface Evaluation {
  overallScore: number;
  skills: {
    technical: number;
    communication: number;
    confidence: number;
    problemSolving: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
  emotionAnalysis: {
    confidence: number;
    engagement: number;
    stressLevel: number;
    positivity: number;
  };
}

interface Answer {
  question: Question;
  evaluation: Evaluation;
  timestamp: string;
}

// Mock savollar bazasi
const interviewQuestions: InterviewQuestions = {
  technical: [
    {
      id: 1,
      question: "React-da state va props farqini tushuntiring?",
      category: "Technical",
      difficulty: "Medium",
      timeLimit: 120,
      tips: [
        "State komponentning ichki holati",
        "Props tashqaridan beriladigan ma'lumotlar",
        "Har ikkalasining o'ziga xos use case'lari bor"
      ]
    },
    {
      id: 2,
      question: "JavaScript-da closure nima va qanday ishlaydi?",
      category: "Technical", 
      difficulty: "Hard",
      timeLimit: 180,
      tips: [
        "Function o'z yaratilgan muhitni eslaydi",
        "Tashqi function ichidagi function",
        "Private variables yaratish uchun ishlatiladi"
      ]
    },
    {
      id: 3,
      question: "REST API va GraphQL farqlari qanday?",
      category: "Technical",
      difficulty: "Medium",
      timeLimit: 150,
      tips: [
        "REST resource-based",
        "GraphQL query-based", 
        "Har ikkalasining ijobiy va salbiy tomonlari"
      ]
    }
  ],
  behavioral: [
    {
      id: 4,
      question: "Sizning eng katta professional muvaffaqiyatingiz qaysi?",
      category: "Behavioral",
      difficulty: "Medium",
      timeLimit: 120,
      tips: [
        "Aniq misol keltiring",
        "STAR methodidan foydalaning",
        "Natijalarni raqamlar bilan ko'rsating"
      ]
    },
    {
      id: 5,
      question: "Qiyin vaziyatda qanday qaror qilasiz?",
      category: "Behavioral",
      difficulty: "Medium", 
      timeLimit: 150,
      tips: [
        "Qaror qabul qilish jarayoningizni tushuntiring",
        "Real misol keltiring",
        "O'rganilgan darslarni aytib bering"
      ]
    }
  ],
  leadership: [
    {
      id: 6,
      question: "Jamoa a'zolari bilan qanday munosabatda bo'lasiz?",
      category: "Leadership",
      difficulty: "Medium",
      timeLimit: 180,
      tips: [
        "Kommunikatsiya uslubingizni tushuntiring",
        "Muvozanatni saqlash usullari",
        "Konfliktlarni hal qilish misollari"
      ]
    }
  ]
};

// Mock AI baholash natijalari
const mockEvaluation: Evaluation = {
  overallScore: 78,
  skills: {
    technical: 82,
    communication: 75,
    confidence: 70,
    problemSolving: 80
  },
  feedback: {
    strengths: [
      "Yaxshi texnik bilim",
      "Muammolarni tahlil qilish qobiliyati",
      "Aniq va tushunarli javoblar"
    ],
    improvements: [
      "Tana tili yanada ishonchli bo'lishi kerak",
      "Javoblarni qisqaroq va aniqroq qilish",
      "Ko'proq misollar keltirish"
    ],
    recommendations: [
      "Public speaking kurslari",
      "Technical interview mashqlari",
      "STAR methodini o'rganish"
    ]
  },
  emotionAnalysis: {
    confidence: 65,
    engagement: 80,
    stressLevel: 45,
    positivity: 70
  }
};

export default function InterviewSimulator() {
  const [interviewType, setInterviewType] = useState<string>('technical');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [interviewFinished, setInterviewFinished] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Video streamni sozlash
  const setupVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Video sozlashda xatolik:', error);
    }
  };

  // Interviewni boshlash
  const startInterview = () => {
    setInterviewStarted(true);
    setupVideo();
    loadNextQuestion();
  };

  // Keyingi savolni yuklash
  const loadNextQuestion = () => {
    const questions = interviewQuestions[interviewType];
    if (currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      setCurrentQuestion(question);
      setTimeLeft(question.timeLimit);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishInterview();
    }
  };

  // Yozib olishni boshlash
  const startRecording = async () => {
    if (!streamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        analyzeResponse(blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Yozib olishda xatolik:', error);
    }
  };

  // Yozib olishni to'xtatish
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Javobni AI orqali tahlil qilish
  const analyzeResponse = async (videoBlob: Blob) => {
    // Mock AI tahlili - haqiqiy loyihada Gemini AI API bilan almashtiriladi
    setTimeout(() => {
      const newEvaluation: Evaluation = {
        ...mockEvaluation,
        overallScore: Math.floor(Math.random() * 30) + 70,
        emotionAnalysis: {
          confidence: Math.floor(Math.random() * 40) + 60,
          engagement: Math.floor(Math.random() * 30) + 70,
          stressLevel: Math.floor(Math.random() * 40) + 30,
          positivity: Math.floor(Math.random() * 30) + 65
        }
      };
      
      setAnswers(prev => [...prev, {
        question: currentQuestion!,
        evaluation: newEvaluation,
        timestamp: new Date().toISOString()
      }]);
      
      loadNextQuestion();
    }, 2000);
  };

  // Interviewni tugatish
  const finishInterview = () => {
    stopRecording();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Final baholash
    const finalEvaluation = calculateFinalEvaluation();
    setEvaluation(finalEvaluation);
    setInterviewFinished(true);
    
    // Natijalarni saqlash (localStorage yoki API ga)
    saveInterviewResults(finalEvaluation);
  };

  // Yakuniy baholashni hisoblash
  const calculateFinalEvaluation = (): Evaluation => {
    if (answers.length === 0) return mockEvaluation;
    
    const totalScore = answers.reduce((sum, answer) => 
      sum + answer.evaluation.overallScore, 0
    ) / answers.length;
    
    return {
      ...mockEvaluation,
      overallScore: Math.round(totalScore),
    };
  };

  // Natijalarni saqlash
  const saveInterviewResults = (results: Evaluation) => {
    const existingResults = JSON.parse(localStorage.getItem('interviewResults') || '[]');
    const newResult = {
      id: Date.now(),
      type: interviewType,
      date: new Date().toISOString(),
      results: results
    };
    localStorage.setItem('interviewResults', JSON.stringify([...existingResults, newResult]));
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && interviewStarted && !interviewFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuestion) {
      stopRecording();
    }
  }, [timeLeft, interviewStarted, interviewFinished]);

  // Component unmount da resurslarni tozalash
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Progress qiymatini hisoblash
  const calculateProgressValue = (): number => {
    if (!currentQuestion) return 0;
    
    const difficulty = currentQuestion.difficulty;
    if (difficulty === 'Easy') return 30;
    if (difficulty === 'Medium') return 60;
    return 90;
  };

  const calculateQuestionProgress = (): number => {
    const questions = interviewQuestions[interviewType];
    if (!questions || questions.length === 0) return 0;
    
    return (currentQuestionIndex / questions.length) * 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Sarlavha */}
        <div>
          <h1 className="text-3xl font-bold">AI Interview Simulator</h1>
          <p className="text-muted-foreground">
            Sun'iy intellekt yordamida real intervyu tajribasi
          </p>
        </div>

        {!interviewStarted ? (
          /* Interview boshlanishi */
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Intervyu Turini Tanlang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(interviewQuestions).map(([type, questions]) => (
                  <div
                    key={type}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      interviewType === type 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setInterviewType(type)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold capitalize">{type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {questions.length} ta savol
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {questions[0]?.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={startInterview}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Intervyuni Boshlash
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qanday Ishlaydi?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Video className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Video va Audio Analiz</h4>
                    <p className="text-sm text-muted-foreground">
                      Yuz ifodasi, tana tili va ovozingiz AI tomonidan tahlil qilinadi
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Brain className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Real-time Baholash</h4>
                    <p className="text-sm text-muted-foreground">
                      Har bir javobingiz darhol baholanadi va tahlil qilinadi
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Takliflar</h4>
                    <p className="text-sm text-muted-foreground">
                      Kuchli va zaif tomonlaringiz bo'yicha shaxsiy tavsiyalar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !interviewFinished ? (
          /* Interview jarayoni */
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Video panel */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Intervyu Jarayoni</span>
                    <Badge variant={isRecording ? "destructive" : "secondary"}>
                      {isRecording ? "Yozilmoqda..." : "Paused"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-black rounded-lg aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full rounded-lg"
                    />
                    {!isVideoOn && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                        <VideoOff className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Timer */}
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  {/* Kontrollar */}
                  <div className="flex justify-center gap-4 mt-4">
                    <Button
                      variant={isVideoOn ? "default" : "outline"}
                      onClick={() => setIsVideoOn(!isVideoOn)}
                    >
                      {isVideoOn ? <Video /> : <VideoOff />}
                    </Button>
                    
                    <Button
                      variant={isRecording ? "destructive" : "default"}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? <Pause /> : <Mic />}
                      {isRecording ? " To'xtatish" : " Javob Berish"}
                    </Button>
                    
                    <Button variant="outline" onClick={loadNextQuestion}>
                      <SkipForward className="h-4 w-4" />
                      Keyingi Savol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Savol va progress panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Joriy Savol</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentQuestion && (
                    <div className="space-y-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {currentQuestion.category}
                        </Badge>
                        <p className="text-lg font-medium">{currentQuestion.question}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Qiyinlik darajasi:</span>
                          <span className="font-medium">{currentQuestion.difficulty}</span>
                        </div>
                        <Progress value={calculateProgressValue()} />
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Maslahatlar:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {currentQuestion.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Savollar:</span>
                      <span>
                        {currentQuestionIndex} / {interviewQuestions[interviewType].length}
                      </span>
                    </div>
                    <Progress value={calculateQuestionProgress()} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Interview natijalari */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Intervyu Natijalari</CardTitle>
              </CardHeader>
              <CardContent>
                {evaluation && (
                  <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {/* Overall Score */}
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">
                          {evaluation.overallScore}%
                        </div>
                        <div className="text-sm text-muted-foreground">Umumiy Baho</div>
                      </div>

                      {/* Skills */}
                      {Object.entries(evaluation.skills).map(([skill, score]) => (
                        <div key={skill} className="text-center p-6 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-700">
                            {score}%
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {skill.replace(/([A-Z])/g, ' $1')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Emotion Analysis */}
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold mb-3">Emotion Analysis</h4>
                        <div className="space-y-3">
                          {Object.entries(evaluation.emotionAnalysis).map(([emotion, score]) => (
                            <div key={emotion} className="flex items-center justify-between">
                              <span className="text-sm capitalize">
                                {emotion.replace(/([A-Z])/g, ' $1')}:
                              </span>
                              <div className="flex items-center gap-2">
                                <Progress value={score as number} className="w-24" />
                                <span className="text-sm font-medium w-8">{score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Feedback */}
                      <div>
                        <h4 className="font-semibold mb-3">AI Feedback</h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-green-600 mb-1">
                              Kuchli Tomonlar
                            </h5>
                            <ul className="text-sm space-y-1">
                              {evaluation.feedback.strengths.map((strength, index) => (
                                <li key={index}>✓ {strength}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-orange-600 mb-1">
                              Takomillashtirish Kerak
                            </h5>
                            <ul className="text-sm space-y-1">
                              {evaluation.feedback.improvements.map((improvement, index) => (
                                <li key={index}>• {improvement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Tavsiyalar</h4>
                      <div className="grid gap-2 md:grid-cols-3">
                        {evaluation.feedback.recommendations.map((rec, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg text-sm">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Harakatlar */}
                    <div className="flex gap-2 mt-6">
                      <Button onClick={() => window.location.reload()}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Yangi Intervyu
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        PDF Export
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}