import { redirect } from "next/navigation"

import { PortalHome } from "@/features/portal/components/portal-home"

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const requested = (await searchParams).cliente
  const clientId = Array.isArray(requested) ? requested[0] : requested
  if (!clientId) redirect("/portal/acceso")

  return <PortalHome requestedClientId={clientId} />
}
