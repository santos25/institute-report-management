export function NoAssignedDegrees() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-tinta">
        Sin grados asignados
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Tu cuenta de docente no tiene grados asignados. Pide al administrador
        que te asigne los grados para consultar planillas y boletines.
      </p>
    </div>
  );
}
