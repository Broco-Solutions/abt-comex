import { PortalHome } from "@/features/portal/components/portal-home"
import { PORTAL_DEMO_CLIENT_ID } from "@/features/portal/data/portal"

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const requested = (await searchParams).cliente
  const clientId =
    (Array.isArray(requested) ? requested[0] : requested) ??
    PORTAL_DEMO_CLIENT_ID

  return <PortalHome requestedClientId={clientId} />
}
