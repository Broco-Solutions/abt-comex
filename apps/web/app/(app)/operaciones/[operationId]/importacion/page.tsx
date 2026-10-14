import { ImportationWorkspace } from "@/features/importation/components/importation-workspace"

export default async function ImportationPage({
  params,
  searchParams,
}: {
  params: Promise<{ operationId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ operationId }, query] = await Promise.all([params, searchParams])
  return <ImportationWorkspace operationId={operationId} searchParams={query} />
}
