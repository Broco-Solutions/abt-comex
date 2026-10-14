import { AdministrationDetail } from "@/features/administration/components/administration-detail"

export default async function AdministracionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ operationId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ operationId }, query] = await Promise.all([params, searchParams])
  const returnToValue = query.returnTo
  const returnTo = Array.isArray(returnToValue)
    ? (returnToValue[0] ?? "")
    : (returnToValue ?? "")
  return <AdministrationDetail operationId={operationId} returnTo={returnTo} />
}
