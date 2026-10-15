import { FinanceOverview } from "@/features/administration/components/finance-overview"

export default async function FinanzasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const workId = Array.isArray(query.trabajo)
    ? (query.trabajo[0] ?? "")
    : (query.trabajo ?? "")
  return <FinanceOverview workId={workId} searchParams={query} />
}
