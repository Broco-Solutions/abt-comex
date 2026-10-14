import { ClientDetail } from "@/features/clients/components/client-detail"

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ clientId }, query] = await Promise.all([params, searchParams])
  return <ClientDetail clientId={clientId} searchParams={query} />
}
