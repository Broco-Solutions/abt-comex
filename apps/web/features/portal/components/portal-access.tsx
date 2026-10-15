"use client"
import { Button } from "@workspace/ui/components/button"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { projectClients } from "@/features/organizations/data/organizations"
import { PORTAL_DEMO_CLIENT_ID } from "../data/portal"
export function PortalAccess() {
  const { choose } = useScenario()
  const client = projectClients().find(
    (item) => item.id === PORTAL_DEMO_CLIENT_ID
  )
  return (
    <section className="mx-auto max-w-xl space-y-6 py-8">
      <h1 className="text-2xl font-semibold">Acceso al Portal</h1>
      {client ? (
        <div className="space-y-4 border-y border-border py-6">
          <h2 className="text-lg font-medium">{client.name}</h2>
          <Button onClick={() => choose("client")}>Entrar al Portal</Button>
        </div>
      ) : (
        <p role="status">No hay una organización disponible.</p>
      )}
    </section>
  )
}
