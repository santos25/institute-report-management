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
import { Degree, Period } from "@prisma/client";

export default function GradeEntrySelection({
  degrees,
  periods,
  selectedDegree,
  selectedPeriod,
  onDegreeChange,
  onPeriodChange,
  onSearch,
  loading,
}: {
  degrees: Degree[];
  periods: Period[];
  selectedDegree: string;
  selectedPeriod: string;
  onDegreeChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Selección de Grado y Periodo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="degree">Grado</Label>
            <Select value={selectedDegree} onValueChange={onDegreeChange}>
              <SelectTrigger id="degree">
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

          <div className="space-y-2">
            <Label htmlFor="period">Periodo</Label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger id="period">
                <SelectValue placeholder="Seleccionar Periodo" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    Periodo {period.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={onSearch}
              disabled={!selectedDegree || !selectedPeriod || loading}
            >
              {loading ? "Cargando..." : "Buscar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
