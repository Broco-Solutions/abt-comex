import Link from "next/link"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { demonstrationClients } from "@/features/clients/data/clients"
import { PORTAL_DEMO_CLIENT_ID } from "../data/portal"

export function PortalAccess() {
  const client = demonstrationClients.find(
    (item) => item.id === PORTAL_DEMO_CLIENT_ID
  )

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Portal de Clientes</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Acceso de demostración
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Elegí el único escenario ficticio habilitado para explorar la vista
          externa. Esto no inicia una sesión segura ni valida permisos reales.
        </p>
      </div>

      {client ? (
        <section
          aria-labelledby="demo-client-title"
          className="space-y-4 border-y border-border py-5"
        >
          <div>
            <h2 id="demo-client-title" className="font-semibold">
              {client.name}
            </h2>
          </div>
          <Link
            href={`/portal?cliente=${PORTAL_DEMO_CLIENT_ID}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Abrir escenario del Portal
          </Link>
        </section>
      ) : (
        <p role="status" className="text-sm text-muted-foreground">
          No hay un escenario ficticio disponible.
        </p>
      )}

      <aside className="border-l-2 border-border pl-4 text-sm text-muted-foreground">
        No ingreses contraseñas ni información de clientes. Invitaciones,
        recuperación de cuenta, notificaciones y permisos efectivos no están
        conectados.
      </aside>
    </div>
  )
}
