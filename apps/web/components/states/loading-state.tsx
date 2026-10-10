export function LoadingState() {
  return (
    <div aria-live="polite" aria-busy="true" className="space-y-6">
      <div className="border-b border-border pb-5">
        <div className="h-7 w-48 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
      </div>
      <div className="max-w-2xl border-l-2 border-border bg-background px-5 py-6">
        <p className="text-sm font-medium">Cargando el módulo</p>
        <p className="mt-1 text-sm text-muted-foreground">
          La navegación y la ubicación actual permanecen disponibles.
        </p>
      </div>
    </div>
  )
}
