import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  TrendingUp,
  Eye,
  Download,
  Star,
  Brain,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";

export default function InterviewResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('interviewResults') || '[]');
    setResults(savedResults);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBadgeVariant = (score) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Sarlavha */}
        <div>
          <h1 className="text-3xl font-bold">Intervyu Natijalari Tarixi</h1>
          <p className="text-muted-foreground">
            Barcha AI intervyu natijalaringiz va progress
          </p>
        </div>

        {/* Statistik kartalar */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jami Intervyular</p>
                  <p className="text-2xl font-bold">{results.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">O'rtacha Baho</p>
                  <p className="text-2xl font-bold">
                    {results.length > 0 
                      ? Math.round(results.reduce((sum, result) => sum + result.results.overallScore, 0) / results.length)
                      : 0
                    }%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eng Yuqori Baho</p>
                  <p className="text-2xl font-bold">
                    {results.length > 0 
                      ? Math.max(...results.map(result => result.results.overallScore))
                      : 0
                    }%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Tahlillar</p>
                  <p className="text-2xl font-bold">
                    {results.reduce((sum, result) => sum + (result.results.answers?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Natijalar jadvali */}
        <Card>
          <CardHeader>
            <CardTitle>Intervyu Tarixi</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Intervyu Turi</TableHead>
                  <TableHead>Umumiy Baho</TableHead>
                  <TableHead>Texnik Ko'nikmalar</TableHead>
                  <TableHead>Kommunikatsiya</TableHead>
                  <TableHead>Ishonch</TableHead>
                  <TableHead className="text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(result.date).toLocaleDateString('uz-UZ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {result.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`font-semibold ${getScoreColor(result.results.overallScore)}`}>
                        {result.results.overallScore}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(result.results.skills.technical)}>
                        {result.results.skills.technical}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(result.results.skills.communication)}>
                        {result.results.skills.communication}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(result.results.skills.confidence)}>
                        {result.results.skills.confidence}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Hali hech qanday intervyu natijalari mavjud emas
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}