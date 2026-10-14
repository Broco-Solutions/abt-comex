import { PortalOperationDetail } from "@/features/portal/components/portal-operation-detail"

export default async function PortalOperationPage({
  params,
  searchParams,
}: {
  params: Promise<{ operationId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ operationId }, query] = await Promise.all([params, searchParams])
  const requested = query.cliente
  const clientId = Array.isArray(requested) ? requested[0] : requested

  return (
    <PortalOperationDetail
      requestedClientId={clientId ?? ""}
      operationId={operationId}
    />
  )
}
