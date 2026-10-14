import { ClientsList } from "@/features/clients/components/clients-list"

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <ClientsList searchParams={await searchParams} />
}
