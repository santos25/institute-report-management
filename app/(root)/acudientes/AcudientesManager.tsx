"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WhatsAppIcon } from "@/components/landing/whatsapp-icon";
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
  createGuardian,
  linkGuardianStudent,
  resetGuardianPassword,
  unlinkGuardianStudent,
  updateGuardian,
  type IssuedGuardianPassword,
  type LinkableStudent,
  type ManagedGuardian,
} from "@/lib/actions/guardian.actions";
import {
  familyLoginUrl,
  guardianWelcomeMessage,
  whatsAppHref,
} from "@/lib/guardian/message";
import { sortDegrees } from "@/lib/utils";

type FormState = {
  id?: string;
  identification: string;
  name: string;
  phone: string;
};

const emptyForm: FormState = { identification: "", name: "", phone: "" };

function studentOrder(students: LinkableStudent[]) {
  const degrees = sortDegrees(
    [...new Set(students.map((student) => student.degreeName))].map((name) => ({
      name,
    }))
  );
  const order = new Map(degrees.map((degree, index) => [degree.name, index]));
  return [...students].sort((a, b) => {
    const byDegree = (order.get(a.degreeName) ?? 99) - (order.get(b.degreeName) ?? 99);
    if (byDegree !== 0) return byDegree;
    return a.name.localeCompare(b.name, "es");
  });
}

export default function AcudientesManager({
  guardians,
  students,
}: {
  guardians: ManagedGuardian[];
  students: LinkableStudent[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [issued, setIssued] = useState<IssuedGuardianPassword | null>(null);
  const [resetTarget, setResetTarget] = useState<ManagedGuardian | null>(null);
  const [linksForId, setLinksForId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [linkError, setLinkError] = useState("");

  const linksFor = guardians.find((guardian) => guardian.id === linksForId) ?? null;
  const orderedStudents = useMemo(() => studentOrder(students), [students]);
  const availableStudents = orderedStudents.filter((student) => {
    if (student.guardianId) return false;
    const query = studentQuery.trim().toLocaleLowerCase("es");
    if (!query) return true;
    return `${student.name} ${student.degreeName}`.toLocaleLowerCase("es").includes(query);
  });

  const openCreate = () => {
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (guardian: ManagedGuardian) => {
    setForm({
      id: guardian.id,
      identification: guardian.identification,
      name: guardian.name,
      phone: guardian.phone ?? "",
    });
    setError("");
    setFormOpen(true);
  };

  const saveGuardian = () => {
    setError("");
    startTransition(async () => {
      const result = form.id
        ? await updateGuardian({
            id: form.id,
            identification: form.identification,
            name: form.name,
            phone: form.phone,
          })
        : await createGuardian({
            identification: form.identification,
            name: form.name,
            phone: form.phone,
          });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setFormOpen(false);
      if (result.issued) {
        setIssued(result.issued);
      } else {
        toast.success("Acudiente actualizado");
      }
      router.refresh();
    });
  };

  const confirmReset = () => {
    if (!resetTarget) return;
    startTransition(async () => {
      const result = await resetGuardianPassword(resetTarget.id);
      if (!result.ok || !result.issued) {
        toast.error(result.ok ? "No se pudo generar la clave." : result.error);
        return;
      }
      setResetTarget(null);
      setIssued(result.issued);
      router.refresh();
    });
  };

  const linkStudent = () => {
    if (!linksFor || !studentId) {
      setLinkError("Elige un estudiante.");
      return;
    }
    setLinkError("");
    startTransition(async () => {
      const result = await linkGuardianStudent({
        guardianId: linksFor.id,
        studentId,
      });
      if (!result.ok) {
        setLinkError(result.error);
        return;
      }
      setStudentId("");
      toast.success("Estudiante vinculado");
      router.refresh();
    });
  };

  const unlinkStudent = (guardianId: string, linkedStudentId: string) => {
    setLinkError("");
    startTransition(async () => {
      const result = await unlinkGuardianStudent({
        guardianId,
        studentId: linkedStudentId,
      });
      if (!result.ok) {
        setLinkError(result.error);
        return;
      }
      toast.success("Estudiante desvinculado");
      router.refresh();
    });
  };

  const loginUrl =
    typeof window === "undefined"
      ? ""
      : familyLoginUrl(process.env.NEXT_PUBLIC_APP_URL?.trim() || window.location.origin);
  const whatsAppUrl = issued?.phone
    ? whatsAppHref(
        issued.phone,
        guardianWelcomeMessage({
          name: issued.name,
          identification: issued.identification,
          password: issued.password,
          loginUrl,
        })
      )
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-tinta">Acudientes</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Crea la cuenta con la cédula, vincula a sus hijos y entrega la clave
            inicial. Cada estudiante tiene un solo acudiente.
          </p>
        </div>
        <Button className="rounded-full" onClick={openCreate}>
          Nuevo acudiente
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Hijos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guardians.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No hay acudientes.
                </TableCell>
              </TableRow>
            ) : (
              guardians.map((guardian) => (
                <TableRow key={guardian.id}>
                  <TableCell className="font-medium text-tinta">{guardian.name}</TableCell>
                  <TableCell>{guardian.identification}</TableCell>
                  <TableCell>{guardian.phone ?? "Sin teléfono"}</TableCell>
                  <TableCell className="max-w-xs whitespace-normal text-muted-foreground">
                    {guardian.students.length === 0
                      ? "Sin hijos"
                      : guardian.students.map((student) => student.name).join(", ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      {guardian.mustChangePassword ? (
                        <span className="inline-flex rounded-full bg-sol-100 px-2.5 py-1 text-xs font-medium text-tinta">
                          Clave inicial
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-azul-50 px-2.5 py-1 text-xs font-medium text-azul-700">
                          Clave propia
                        </span>
                      )}
                      {guardian.locked ? (
                        <span className="inline-flex rounded-full bg-coral-100 px-2.5 py-1 text-xs font-medium text-tinta">
                          Bloqueada
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => openEdit(guardian)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          setLinksForId(guardian.id);
                          setStudentId("");
                          setStudentQuery("");
                          setLinkError("");
                        }}
                      >
                        Hijos
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => setResetTarget(guardian)}
                      >
                        Nueva clave
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-tinta">
              {form.id ? "Editar acudiente" : "Nuevo acudiente"}
            </DialogTitle>
            <DialogDescription>
              La cédula es el usuario de ingreso. La clave inicial se muestra una sola vez.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="guardian-cedula">Cédula</Label>
              <Input
                id="guardian-cedula"
                inputMode="numeric"
                autoComplete="off"
                value={form.identification}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    identification: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian-name">Nombre</Label>
              <Input
                id="guardian-name"
                autoComplete="name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian-phone">Teléfono (opcional)</Label>
              <Input
                id="guardian-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="3001234567"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
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
              onClick={saveGuardian}
              disabled={pending}
            >
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(issued)}
        onOpenChange={(open) => {
          if (!open) setIssued(null);
        }}
      >
        <DialogContent
          className="bg-card"
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-tinta">Clave inicial</DialogTitle>
            <DialogDescription>
              Se muestra una sola vez. Al cerrar esta ventana tendrás que generar otra
              para volver a verla. {issued?.name} debe crear su propia clave en el primer ingreso.
            </DialogDescription>
          </DialogHeader>
          {issued ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="issued-user">Usuario</Label>
                <Input id="issued-user" readOnly value={issued.identification} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issued-password">Clave inicial</Label>
                <Input id="issued-password" readOnly value={issued.password} />
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(issued.password);
                    toast.success("Clave copiada");
                  } catch {
                    toast.error("Selecciona la clave y cópiala a mano.");
                  }
                }}
              >
                Copiar clave
              </Button>
            </div>
          ) : null}
          <DialogFooter>
            {whatsAppUrl ? (
              <Button
                type="button"
                className="rounded-full bg-whatsapp text-tinta hover:bg-whatsapp/90"
                asChild
              >
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" />
                  Enviar por WhatsApp
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Agrega un teléfono para enviar la clave por WhatsApp.
              </p>
            )}
            <Button type="button" className="rounded-full" onClick={() => setIssued(null)}>
              Ya la copié
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(resetTarget)}
        onOpenChange={(open) => {
          if (!open) setResetTarget(null);
        }}
      >
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-tinta">Nueva clave inicial</DialogTitle>
            <DialogDescription>
              La clave anterior de {resetTarget?.name} dejará de funcionar. En el próximo
              ingreso deberá crear una clave propia.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setResetTarget(null)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={confirmReset}
              disabled={pending}
            >
              {pending ? "Generando…" : "Generar clave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(linksFor)}
        onOpenChange={(open) => {
          if (!open) setLinksForId(null);
        }}
      >
        <DialogContent className="bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-tinta">
              Hijos de {linksFor?.name}
            </DialogTitle>
            <DialogDescription>
              Un estudiante solo puede estar vinculado a un acudiente.
            </DialogDescription>
          </DialogHeader>
          {linkError ? (
            <p className="text-sm text-destructive" role="alert">
              {linkError}
            </p>
          ) : null}
          <ul className="space-y-2">
            {linksFor && linksFor.students.length === 0 ? (
              <li className="text-sm text-muted-foreground">Sin hijos vinculados.</li>
            ) : (
              linksFor?.students.map((student) => (
                <li
                  key={student.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
                >
                  <span className="text-sm text-tinta">
                    {student.name}
                    <span className="block text-muted-foreground">{student.degreeName}</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={pending}
                    onClick={() => unlinkStudent(linksFor.id, student.id)}
                  >
                    Desvincular
                  </Button>
                </li>
              ))
            )}
          </ul>
          <div className="space-y-2">
            <Label htmlFor="student-search">Buscar estudiante libre</Label>
            <Input
              id="student-search"
              value={studentQuery}
              placeholder="Nombre o grado"
              onChange={(event) => setStudentQuery(event.target.value)}
            />
            <Label htmlFor="student-link">Estudiante</Label>
            <select
              id="student-link"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-tinta outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Elige un estudiante</option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} — {student.degreeName}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setLinksForId(null)}
            >
              Cerrar
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={linkStudent}
              disabled={pending || availableStudents.length === 0}
            >
              Vincular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
