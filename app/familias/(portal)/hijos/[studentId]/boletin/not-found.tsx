import Link from "next/link";

export default function BoletinNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-tinta">
        No encontramos ese estudiante
      </h1>
      <p className="mt-2 text-sm text-tinta">
        Esa ficha no está vinculada a esta cuenta.
      </p>
      <Link
        href="/familias"
        className="mt-6 inline-block text-sm font-semibold text-azul-700 underline-offset-4 hover:underline"
      >
        Volver a tus hijos
      </Link>
    </div>
  );
}
