import { AdministrationQueue } from "@/features/administration/components/administration-queue"

export default async function AdministracionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <AdministrationQueue searchParams={await searchParams} />
}
