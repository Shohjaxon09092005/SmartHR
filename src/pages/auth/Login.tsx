import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already authenticated
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Muvaffaqiyatli kirdingiz!");
      
      // Get user role and redirect
      const currentUser = useAuthStore.getState().user;
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("Email yoki parol xato!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">SmartHR Uzbekistan</CardTitle>
          <CardDescription>
            Hisobingizga kirish uchun ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email yoki telefon</Label>
              <Input
                id="email"
                type="text"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kirish
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Hisobingiz yo'qmi? </span>
            <Link to="/register" className="text-primary hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </div>
          <div className="mt-6 space-y-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium">Test uchun:</p>
            <p>Admin: admin@test.com</p>
            <p>Employer: employer@test.com</p>
            <p>Job Seeker: jobseeker@test.com</p>
            <p>Parol: istalgan</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
