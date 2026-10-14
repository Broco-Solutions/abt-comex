import { ExportationWorkspace } from "@/features/exportation/components/exportation-workspace"

export default async function ExportationPage({
  params,
  searchParams,
}: {
  params: Promise<{ operationId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ operationId }, query] = await Promise.all([params, searchParams])
  return <ExportationWorkspace operationId={operationId} searchParams={query} />
}
