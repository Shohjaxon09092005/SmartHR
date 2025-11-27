import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Briefcase, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Bot,
  FileText,
  Target,
  Rocket,
  Star
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SmartGov
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Kirish</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Ro'yxatdan o'tish</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-white/50 px-4 py-2 text-sm backdrop-blur-sm dark:bg-gray-800/50">
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              <span className="text-muted-foreground">
                AI yordamida ish topish platformasi
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                O'zbekistonning eng yaxshi
              </span>
              <br />
              <span className="text-foreground">Ish topish platformasi</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl">
              AI texnologiyalari yordamida professional resume yarating, vakansiyalarni toping va 
              orzuingizdagi ishga erishing
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group text-lg" asChild>
                <Link to="/register">
                  Boshlash
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link to="/login">
                  Kirish
                </Link>
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>100% Bepul</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>AI yordami</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Tezkor va oson</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Quyidagi xususiyatlar bilan ish toping
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Zamonaviy AI texnologiyalari bilan qurollangan platforma
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 transition-all hover:border-purple-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <CardTitle>AI Resume Generator</CardTitle>
                <CardDescription>
                  Gemini AI yordamida professional resume yarating. Faqat 60 soniyada tayyor!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    ATS-friendly format
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Professional struktura
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Avtomatik optimallashtirish
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-purple-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle>CV Analyzer</CardTitle>
                <CardDescription>
                  CV ni tahlil qiling va AI orqali professional tavsiyalar oling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Ko'nikmalar tahlili
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Yaxshilash tavsiyalari
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Match score hisoblash
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-purple-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Smart Job Matching</CardTitle>
                <CardDescription>
                  Sizning ko'nikmalaringizga mos vakansiyalarni avtomatik toping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    AI-powered matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Aniq tavsiyalar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Match score ko'rsatkich
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-purple-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Interview Simulator</CardTitle>
                <CardDescription>
                  Intervyular uchun tayyorgarlik ko'ring. AI bilan mashq qiling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Real-time intervyu
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    AI javoblar tahlili
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Tavsiyalar va yaxshilash
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-purple-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Employer Tools</CardTitle>
                <CardDescription>
                  Ish beruvchilar uchun kuchli vakansiya boshqaruv vositasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Vakansiya yaratish
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Nomzodlarni ko'rish
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Application boshqaruvi
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-purple-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Career Growth</CardTitle>
                <CardDescription>
                  Karyerangizni rivojlantiring va yangi imkoniyatlarni toping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Ko'nikmalar rivojlantirish
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Portfolio yaratish
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Professional network
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-24 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Nima uchun SmartGov?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Bizning platforma nima bilan ajralib turadi
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Tezkor</h3>
              <p className="text-sm text-muted-foreground">
                60 soniyada professional resume yarating
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Xavfsiz</h3>
              <p className="text-sm text-muted-foreground">
                Ma'lumotlaringiz xavfsiz va shaxsiy
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">O'zbek tilida</h3>
              <p className="text-sm text-muted-foreground">
                To'liq o'zbek tilida qo'llab-quvvatlash
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Bepul</h3>
              <p className="text-sm text-muted-foreground">
                100% bepul, hech qanday yashirin to'lovlar yo'q
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-purple-600">10K+</div>
              <div className="text-muted-foreground">Foydalanuvchilar</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600">5K+</div>
              <div className="text-muted-foreground">Vakansiyalar</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-indigo-600">8K+</div>
              <div className="text-muted-foreground">Muvaffaqiyatli arizalar</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-600">95%</div>
              <div className="text-muted-foreground">Mamnun foydalanuvchilar</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-24">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Bugun boshlang va orzuingizdagi ishni toping
          </h2>
          <p className="mb-8 text-lg text-purple-100">
            Hech qanday to'lovsiz ro'yxatdan o'ting va AI yordami bilan professional resume yarating
          </p>
          <Button size="lg" variant="secondary" className="text-lg" asChild>
            <Link to="/register">
              Bepul boshlash
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">SmartGov</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O'zbekistonning eng yaxshi ish topish platformasi. AI yordami bilan karyerangizni rivojlantiring.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Platforma</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/landing-page" className="text-muted-foreground hover:text-foreground">
                    Bosh sahifa
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-muted-foreground hover:text-foreground">
                    Ro'yxatdan o'tish
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-muted-foreground hover:text-foreground">
                    Kirish
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Xizmatlar</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>AI Resume Generator</li>
                <li>CV Analyzer</li>
                <li>Job Matching</li>
                <li>Interview Simulator</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Yordam</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Qo'llanma</li>
                <li>FAQ</li>
                <li>Aloqa</li>
                <li>Qo'llab-quvvatlash</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SmartGov. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

