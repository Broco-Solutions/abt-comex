import { ManagementOverview } from "@/features/management/components/management-overview"

export default async function GestionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <ManagementOverview searchParams={await searchParams} />
}
