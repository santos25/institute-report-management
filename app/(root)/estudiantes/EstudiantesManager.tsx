"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Degree } from "@prisma/client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createStudent,
  deleteStudent,
  updateStudent,
  type ManagedStudent,
} from "@/lib/actions/student.actions";
import { sortDegrees } from "@/lib/utils";

type DegreeOption = { id: string; name: string };

type FormState = {
  id?: string;
  name: string;
  identification: string;
  degreeId: string;
};

const selectClassName =
  "h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-tinta outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function recordLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default function EstudiantesManager({
  students,
  degrees,
  canManage,
}: {
  students: ManagedStudent[];
  degrees: DegreeOption[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ManagedStudent | null>(null);
  const [acknowledge, setAcknowledge] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    identification: "",
    degreeId: "",
  });
  const [error, setError] = useState("");

  const orderedDegrees = sortDegrees(
    degrees.map((degree) => ({ ...degree })) as Degree[]
  );

  const filtered = useMemo(() => {
    const needle = normalize(query);
    return students.filter((student) => {
      if (degreeFilter !== "all" && student.degreeId !== degreeFilter) {
        return false;
      }
      if (!needle) return true;
      return (
        normalize(student.name).includes(needle) ||
        normalize(student.identification).includes(needle)
      );
    });
  }, [degreeFilter, query, students]);

  const openCreate = () => {
    setForm({
      name: "",
      identification: "",
      degreeId: degreeFilter !== "all" ? degreeFilter : orderedDegrees[0]?.id ?? "",
    });
    setError("");
    setFormOpen(true);
  };

  const openEdit = (student: ManagedStudent) => {
    setForm({
      id: student.id,
      name: student.name,
      identification: student.identification,
      degreeId: student.degreeId,
    });
    setError("");
    setFormOpen(true);
  };

  const openDelete = (student: ManagedStudent) => {
    setAcknowledge(false);
    setError("");
    setDeleteTarget(student);
  };

  const saveStudent = () => {
    setError("");
    startTransition(async () => {
      const result = form.id
        ? await updateStudent({
            id: form.id,
            name: form.name,
            identification: form.identification,
            degreeId: form.degreeId,
          })
        : await createStudent({
            name: form.name,
            identification: form.identification,
            degreeId: form.degreeId,
          });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setFormOpen(false);
      toast.success(form.id ? "Estudiante actualizado" : "Estudiante creado");
      router.refresh();
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const hasRecords =
      deleteTarget.gradeCount > 0 || deleteTarget.observationCount > 0;
    startTransition(async () => {
      const result = await deleteStudent(
        deleteTarget.id,
        hasRecords ? acknowledge : false
      );
      if (!result.ok) {
        if (result.requiresAcknowledgement) {
          setDeleteTarget((current) =>
            current
              ? {
                  ...current,
                  gradeCount: result.gradeCount ?? current.gradeCount,
                  observationCount:
                    result.observationCount ?? current.observationCount,
                }
              : current
          );
          setAcknowledge(false);
        }
        setError(result.error);
        return;
      }
      setDeleteTarget(null);
      toast.success("Estudiante eliminado");
      router.refresh();
    });
  };

  const hasRecords =
    (deleteTarget?.gradeCount ?? 0) > 0 ||
    (deleteTarget?.observationCount ?? 0) > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-tinta">
            Estudiantes
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {canManage
              ? "Crea, edita y organiza los estudiantes por grado."
              : "Consulta los estudiantes de tus grados. Solo el administrador puede modificar esta lista."}
          </p>
        </div>
        {canManage ? (
          <Button className="rounded-full" onClick={openCreate}>
            Nuevo estudiante
          </Button>
        ) : null}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="degree-filter">Grado</Label>
          <select
            id="degree-filter"
            value={degreeFilter}
            onChange={(event) => setDegreeFilter(event.target.value)}
            className={selectClassName}
          >
            <option value="all">Todos los grados</option>
            {orderedDegrees.map((degree) => (
              <option key={degree.id} value={degree.id}>
                {degree.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-search">Buscar</Label>
          <Input
            id="student-search"
            type="search"
            value={query}
            placeholder="Nombre o documento de identidad"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        {filtered.length === 1
          ? "1 estudiante"
          : `${filtered.length} estudiantes`}
      </p>

      <div className="hidden rounded-xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Grado</TableHead>
              {canManage ? (
                <TableHead className="text-right">Acciones</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canManage ? 4 : 3}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay estudiantes con ese grado o esa búsqueda.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-tinta">
                    {student.name}
                  </TableCell>
                  <TableCell>
                    {student.identification || "Sin documento"}
                  </TableCell>
                  <TableCell>{student.degreeName}</TableCell>
                  {canManage ? (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => openEdit(student)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full text-destructive"
                          onClick={() => openDelete(student)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ul className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            No hay estudiantes con ese grado o esa búsqueda.
          </li>
        ) : (
          filtered.map((student) => (
            <li
              key={student.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="font-medium text-tinta">{student.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {student.identification || "Sin documento"}
              </p>
              <p className="mt-1 text-sm text-tinta">{student.degreeName}</p>
              {canManage ? (
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => openEdit(student)}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive"
                    onClick={() => openDelete(student)}
                  >
                    Eliminar
                  </Button>
                </div>
              ) : null}
            </li>
          ))
        )}
      </ul>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-tinta">
              {form.id ? "Editar estudiante" : "Nuevo estudiante"}
            </DialogTitle>
            <DialogDescription>
              {form.id
                ? "Actualiza el nombre, el documento de identidad o el grado."
                : "Escribe el nombre completo, el documento de identidad y el grado."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="student-name">Nombre completo</Label>
              <Input
                id="student-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-identification">
                Documento de identidad
              </Label>
              <Input
                id="student-identification"
                value={form.identification}
                autoCapitalize="none"
                spellCheck={false}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    identification: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-degree">Grado</Label>
              <select
                id="student-degree"
                value={form.degreeId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    degreeId: event.target.value,
                  }))
                }
                className={selectClassName}
              >
                {orderedDegrees.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setFormOpen(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={saveStudent}
              disabled={pending}
            >
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setError("");
          }
        }}
      >
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-tinta">
              Eliminar estudiante
            </DialogTitle>
            <DialogDescription>
              ¿Eliminar a {deleteTarget?.name}? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {hasRecords ? (
            <div
              className="rounded-lg border border-sol-300 bg-sol-100 px-3 py-3 text-sm text-tinta"
              role="alert"
            >
              <p>
                Este estudiante tiene{" "}
                {recordLabel(deleteTarget?.gradeCount ?? 0, "nota", "notas")} y{" "}
                {recordLabel(
                  deleteTarget?.observationCount ?? 0,
                  "observación",
                  "observaciones"
                )}
                . Si confirmas, también se eliminarán esos registros para no
                dejar datos sueltos.
              </p>
              <label className="mt-3 flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-azul-500"
                  checked={acknowledge}
                  onChange={(event) => setAcknowledge(event.target.checked)}
                />
                <span>
                  Confirmo que quiero eliminar al estudiante y sus registros
                  académicos.
                </span>
              </label>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setDeleteTarget(null)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-full"
              onClick={confirmDelete}
              disabled={pending || (hasRecords && !acknowledge)}
            >
              {pending
                ? "Eliminando…"
                : hasRecords
                  ? "Eliminar estudiante y registros"
                  : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
