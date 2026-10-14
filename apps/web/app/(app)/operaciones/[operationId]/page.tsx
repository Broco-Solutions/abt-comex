import { OperationDetail } from "@/features/operations/components/operation-detail"

export default async function OperationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ operationId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ operationId }, query] = await Promise.all([params, searchParams])
  return <OperationDetail operationId={operationId} searchParams={query} />
}
