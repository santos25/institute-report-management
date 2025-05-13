import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Degree } from "@prisma/client";

// Selection form component for reports
export default function ReportSelection({
  degrees,
  years,
  selectedDegree,
  selectedYear,
  onDegreeChange,
  onYearChange,
  onSearch,
  loading = false,
}: {
  degrees: Degree[];
  years: { id: string; year: number }[];
  selectedDegree: string;
  selectedYear: string;
  onDegreeChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Generación de Boletines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportYear">Año</Label>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger id="reportYear">
                <SelectValue placeholder="Seleccionar Año" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportDegree">Grado</Label>
            <Select value={selectedDegree} onValueChange={onDegreeChange}>
              <SelectTrigger id="reportDegree">
                <SelectValue placeholder="Seleccionar Grado" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((degree) => (
                  <SelectItem key={degree.id} value={degree.id}>
                    {degree.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={onSearch}
              disabled={!selectedDegree || !selectedYear || loading}
            >
              {loading ? "Cargando..." : "Buscar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
