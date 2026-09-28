import Image from "next/image"
import type { Metadata } from "next"

import { OperationsWorkspace } from "./operations-workspace"

export const metadata: Metadata = {
  title: "Patrones de datos y operación | ABT Comex",
  description:
    "Referencia interna de patrones para listados operativos de comercio exterior.",
}

export default function DataDesignSystemPage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              ABT Comex · Interno
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Patrones de datos y operación
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Referencia para listados operativos de Importaciones,
              Exportaciones y Administración.
            </p>
          </div>
          <Image
            src="/brand/ABT_COMEX_logo_green_transparent.png"
            alt="ABT Comex"
            width={1983}
            height={793}
            priority
            className="h-auto w-32 shrink-0 object-contain sm:w-36"
          />
        </header>

        <OperationsWorkspace />
      </div>
    </main>
  )
}
