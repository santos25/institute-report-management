"use client";

import { useState, useTransition } from "react";
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
  createUser,
  deleteUser,
  updateUser,
  type ManagedUser,
} from "@/lib/actions/user.actions";
import { roleLabel, type Role } from "@/lib/auth/roles";
import { sortDegrees } from "@/lib/utils";

type DegreeOption = { id: string; name: string };

type FormState = {
  id?: string;
  name: string;
  username: string;
  password: string;
  role: Role;
  degreeIds: string[];
};

const emptyForm: FormState = {
  name: "",
  username: "",
  password: "",
  role: "TEACHER",
  degreeIds: [],
};

function degreeNames(user: ManagedUser, order: Map<string, number>) {
  if (user.role === "ADMIN") return "Todos los grados";
  if (user.degrees.length === 0) return "Sin grados";
  return [...user.degrees]
    .sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99))
    .map((degree) => degree.name)
    .join(", ");
}

export default function UsuariosManager({
  users,
  degrees,
  currentUserId,
}: {
  users: ManagedUser[];
  degrees: DegreeOption[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");

  const orderedDegrees = sortDegrees(
    degrees.map((degree) => ({ ...degree })) as Degree[]
  );
  const degreeOrder = new Map(orderedDegrees.map((degree, index) => [degree.id, index]));

  const openCreate = () => {
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (user: ManagedUser) => {
    setForm({
      id: user.id,
      name: user.name,
      username: user.username,
      password: "",
      role: user.role,
      degreeIds: user.degrees.map((degree) => degree.id),
    });
    setError("");
    setFormOpen(true);
  };

  const toggleDegree = (degreeId: string) => {
    setForm((current) => ({
      ...current,
      degreeIds: current.degreeIds.includes(degreeId)
        ? current.degreeIds.filter((id) => id !== degreeId)
        : [...current.degreeIds, degreeId],
    }));
  };

  const saveUser = () => {
    setError("");
    startTransition(async () => {
      const result = form.id
        ? await updateUser({
            id: form.id,
            name: form.name,
            role: form.role,
            password: form.password,
            degreeIds: form.role === "TEACHER" ? form.degreeIds : [],
          })
        : await createUser({
            name: form.name,
            username: form.username,
            password: form.password,
            role: form.role,
            degreeIds: form.role === "TEACHER" ? form.degreeIds : [],
          });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setFormOpen(false);
      toast.success(form.id ? "Usuario actualizado" : "Usuario creado");
      router.refresh();
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteUser(deleteTarget.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setDeleteTarget(null);
      toast.success("Usuario eliminado");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-tinta">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea cuentas y asigna grados a los docentes.
          </p>
        </div>
        <Button className="rounded-full" onClick={openCreate}>
          Nuevo usuario
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Grados</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No hay usuarios.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-tinta">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <span
                      className={
                        user.role === "ADMIN"
                          ? "inline-flex rounded-full bg-azul-50 px-2.5 py-1 text-xs font-medium text-azul-700"
                          : "inline-flex rounded-full bg-sol-100 px-2.5 py-1 text-xs font-medium text-tinta"
                      }
                    >
                      {roleLabel(user.role)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal text-muted-foreground">
                    {degreeNames(user, degreeOrder)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => openEdit(user)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full text-destructive"
                        disabled={user.id === currentUserId}
                        title={
                          user.id === currentUserId
                            ? "No puedes eliminar tu propia cuenta"
                            : undefined
                        }
                        onClick={() => setDeleteTarget(user)}
                      >
                        Eliminar
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
              {form.id ? "Editar usuario" : "Nuevo usuario"}
            </DialogTitle>
            <DialogDescription>
              {form.id
                ? "Actualiza el nombre, el rol, los grados y, si quieres, la contraseña."
                : "Completa los datos de la cuenta. La contraseña se guarda cifrada."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="user-name">Nombre</Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-username">Usuario</Label>
              <Input
                id="user-username"
                value={form.username}
                autoCapitalize="none"
                spellCheck={false}
                disabled={Boolean(form.id)}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">
                {form.id ? "Nueva contraseña" : "Contraseña"}
              </Label>
              <Input
                id="user-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                placeholder={form.id ? "Dejar en blanco para no cambiar" : undefined}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Rol</Label>
              <select
                id="user-role"
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value as Role,
                  }))
                }
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-tinta outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="ADMIN">Administrador</option>
                <option value="TEACHER">Docente</option>
              </select>
            </div>
            {form.role === "TEACHER" && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-tinta">
                  Grados asignados
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {orderedDegrees.map((degree) => (
                    <label
                      key={degree.id}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-tinta"
                    >
                      <input
                        type="checkbox"
                        className="size-4 accent-azul-500"
                        checked={form.degreeIds.includes(degree.id)}
                        onChange={() => toggleDegree(degree.id)}
                      />
                      {degree.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
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
              onClick={saveUser}
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
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-tinta">
              Eliminar usuario
            </DialogTitle>
            <DialogDescription>
              ¿Eliminar a {deleteTarget?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
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
              disabled={pending}
            >
              {pending ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
