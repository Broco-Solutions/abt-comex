import { OperationsList } from "@/features/operations/components/operations-list"

export default async function OperacionesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <OperationsList searchParams={await searchParams} />
}
