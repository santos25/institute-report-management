"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createAchievementTemplate,
  createObservationTemplate,
  deleteAchievementTemplate,
  deleteObservationTemplate,
  updateAchievementTemplate,
  updateObservationTemplate,
} from "@/lib/actions/bank.actions";
import {
  PERFORMANCE_LABELS,
  PERFORMANCES,
  performanceClass,
  type BankAchievement,
  type BankObservation,
  type BankSubject,
  type Performance,
} from "@/lib/bank";
import { cn } from "@/lib/utils";

type DeleteTarget =
  | { kind: "achievement"; id: string; content: string }
  | { kind: "observation"; id: string; content: string };

const ALL = "all";

export default function BancoManager({
  subjects,
  achievements,
  observations,
}: {
  subjects: BankSubject[];
  achievements: BankAchievement[];
  observations: BankObservation[];
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-tinta">
        Banco de logros y observaciones
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Frases listas para insertar en las planillas. Administradores y docentes
        pueden crearlas, editarlas y eliminarlas.
      </p>

      <Tabs defaultValue="logros" className="mt-6 gap-4">
        <TabsList className="h-10 rounded-full bg-muted p-1">
          <TabsTrigger
            value="logros"
            className="rounded-full px-4 data-[state=active]:bg-card data-[state=active]:text-azul-700"
          >
            Logros
          </TabsTrigger>
          <TabsTrigger
            value="observaciones"
            className="rounded-full px-4 data-[state=active]:bg-card data-[state=active]:text-azul-700"
          >
            Observaciones
          </TabsTrigger>
        </TabsList>
        <TabsContent value="logros">
          <AchievementsPanel subjects={subjects} achievements={achievements} />
        </TabsContent>
        <TabsContent value="observaciones">
          <ObservationsPanel observations={observations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AchievementsPanel({
  subjects,
  achievements,
}: {
  subjects: BankSubject[];
  achievements: BankAchievement[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [performance, setPerformance] = useState<Performance>("S");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filterSubject, setFilterSubject] = useState(ALL);
  const [filterPerformance, setFilterPerformance] = useState<Performance | typeof ALL>(
    ALL
  );
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const visible = useMemo(
    () =>
      achievements.filter((item) => {
        if (filterSubject !== ALL && item.subjectId !== filterSubject) return false;
        if (filterPerformance !== ALL && item.performance !== filterPerformance) {
          return false;
        }
        return true;
      }),
    [achievements, filterPerformance, filterSubject]
  );

  const resetForm = () => {
    setEditingId(null);
    setContent("");
    setError("");
    setPerformance("S");
    setSubjectId(subjects[0]?.id ?? "");
  };

  const save = () => {
    setError("");
    startTransition(async () => {
      const result = editingId
        ? await updateAchievementTemplate({
            id: editingId,
            content,
            subjectId,
            performance,
          })
        : await createAchievementTemplate({ content, subjectId, performance });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      toast.success(editingId ? "Logro actualizado" : "Logro agregado");
      resetForm();
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <form
        className="space-y-4 rounded-xl border border-border bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!pending) save();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="achievement-subject">Materia</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger id="achievement-subject" className="w-full bg-card">
                <SelectValue placeholder="Seleccionar materia" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="achievement-performance">Desempeño</Label>
            <Select
              value={performance}
              onValueChange={(value) => setPerformance(value as Performance)}
            >
              <SelectTrigger id="achievement-performance" className="w-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERFORMANCES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value} · {PERFORMANCE_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="achievement-content">
            {editingId ? "Editar logro" : "Nuevo logro"}
          </Label>
          <Textarea
            id="achievement-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Escribe la frase que se insertará en la planilla…"
            className="min-h-24 bg-card"
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="rounded-full" disabled={pending || !subjectId}>
            {pending ? "Guardando…" : editingId ? "Guardar cambios" : "Agregar logro"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={resetForm}
              disabled={pending}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor="filter-subject">Filtrar por materia</Label>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger id="filter-subject" className="w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas las materias</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por desempeño">
          <FilterChip
            active={filterPerformance === ALL}
            onClick={() => setFilterPerformance(ALL)}
          >
            Todos
          </FilterChip>
          {PERFORMANCES.map((value) => (
            <FilterChip
              key={value}
              active={filterPerformance === value}
              onClick={() => setFilterPerformance(value)}
              className={filterPerformance === value ? performanceClass(value) : undefined}
            >
              {value}
            </FilterChip>
          ))}
        </div>
      </div>

      <PhraseList
        empty="No hay logros con estos filtros."
        items={visible.map((item) => ({
          id: item.id,
          content: item.content,
          meta: (
            <>
              <span className="rounded-full bg-azul-50 px-2.5 py-1 text-xs font-medium text-azul-700">
                {item.subjectName}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  performanceClass(item.performance)
                )}
              >
                {item.performance} · {PERFORMANCE_LABELS[item.performance]}
              </span>
            </>
          ),
          onEdit: () => {
            setEditingId(item.id);
            setSubjectId(item.subjectId);
            setPerformance(item.performance);
            setContent(item.content);
            setError("");
          },
          onDelete: () =>
            setDeleteTarget({
              kind: "achievement",
              id: item.id,
              content: item.content,
            }),
        }))}
      />

      <DeletePhraseDialog
        target={deleteTarget}
        pending={pending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget || deleteTarget.kind !== "achievement") return;
          startTransition(async () => {
            const result = await deleteAchievementTemplate(deleteTarget.id);
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            if (editingId === deleteTarget.id) resetForm();
            setDeleteTarget(null);
            toast.success("Logro eliminado");
            router.refresh();
          });
        }}
      />
    </div>
  );
}

function ObservationsPanel({ observations }: { observations: BankObservation[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setContent("");
    setCategory("");
    setError("");
  };

  const save = () => {
    setError("");
    startTransition(async () => {
      const result = editingId
        ? await updateObservationTemplate({ id: editingId, content, category })
        : await createObservationTemplate({ content, category });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      toast.success(editingId ? "Observación actualizada" : "Observación agregada");
      resetForm();
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <form
        className="space-y-4 rounded-xl border border-border bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!pending) save();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="observation-category">Categoría (opcional)</Label>
          <Input
            id="observation-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Convivencia, familia, hábitos…"
            className="bg-card"
            maxLength={40}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="observation-content">
            {editingId ? "Editar observación" : "Nueva observación"}
          </Label>
          <Textarea
            id="observation-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Escribe la observación que se insertará en la planilla…"
            className="min-h-24 bg-card"
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="rounded-full" disabled={pending}>
            {pending
              ? "Guardando…"
              : editingId
                ? "Guardar cambios"
                : "Agregar observación"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={resetForm}
              disabled={pending}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>

      <PhraseList
        empty="Todavía no hay observaciones en el banco."
        items={observations.map((item) => ({
          id: item.id,
          content: item.content,
          meta: item.category ? (
            <span className="rounded-full bg-coral-100 px-2.5 py-1 text-xs font-medium text-tinta">
              {item.category}
            </span>
          ) : null,
          onEdit: () => {
            setEditingId(item.id);
            setContent(item.content);
            setCategory(item.category ?? "");
            setError("");
          },
          onDelete: () =>
            setDeleteTarget({
              kind: "observation",
              id: item.id,
              content: item.content,
            }),
        }))}
      />

      <DeletePhraseDialog
        target={deleteTarget}
        pending={pending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget || deleteTarget.kind !== "observation") return;
          startTransition(async () => {
            const result = await deleteObservationTemplate(deleteTarget.id);
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            if (editingId === deleteTarget.id) resetForm();
            setDeleteTarget(null);
            toast.success("Observación eliminada");
            router.refresh();
          });
        }}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  className,
  children,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        active
          ? "border-transparent"
          : "border-border bg-card text-tinta-600 hover:bg-azul-50",
        active && !className && "bg-primary text-primary-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

function PhraseList({
  items,
  empty,
}: {
  empty: string;
  items: {
    id: string;
    content: string;
    meta: ReactNode;
    onEdit: () => void;
    onDelete: () => void;
  }[];
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        {empty}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-card">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0">
            {item.meta ? (
              <div className="mb-2 flex flex-wrap items-center gap-2">{item.meta}</div>
            ) : null}
            <p className="whitespace-pre-wrap text-sm text-tinta">{item.content}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={item.onEdit}
            >
              Editar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full text-destructive hover:text-destructive"
              onClick={item.onDelete}
            >
              Eliminar
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function DeletePhraseDialog({
  target,
  pending,
  onCancel,
  onConfirm,
}: {
  target: DeleteTarget | null;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={target != null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {target?.kind === "observation"
              ? "Eliminar observación"
              : "Eliminar logro"}
          </DialogTitle>
          <DialogDescription>
            La frase se quita del banco. Las planillas que ya la usaron conservan
            el texto guardado.
          </DialogDescription>
        </DialogHeader>
        {target ? (
          <p className="line-clamp-3 text-sm text-tinta">{target.content}</p>
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={onCancel}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-full"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? "Eliminando…" : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
