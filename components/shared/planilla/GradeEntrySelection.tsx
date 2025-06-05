import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortDegrees } from "@/lib/utils";
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
    <Card className="mb-6 border rounded-lg shadow-sm">
      <CardContent>
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="w-full md:w-1/3 space-y-2">
            <Label
              htmlFor="degree"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Grado
            </Label>
            <Select value={selectedDegree} onValueChange={onDegreeChange}>
              <SelectTrigger
                id="degree"
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Seleccionar Grado" />
              </SelectTrigger>
              <SelectContent>
                {sortDegrees(degrees).map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
                {/* {degrees.map((degree) => (
                  <SelectItem key={degree.id} value={degree.id}>
                    {degree.name}
                  </SelectItem>
                ))} */}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3 space-y-2">
            <Label
              htmlFor="period"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Periodo Académico
            </Label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger
                id="period"
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
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

          <div className="w-full md:w-1/3 md:self-end">
            <Button
              className="w-full font-medium py-2 transition-colors shadow-sm"
              onClick={onSearch}
              disabled={!selectedDegree || !selectedPeriod || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cargando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Buscar Calificaciones
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
