import { OrganizationList } from "@/features/organizations/components/organization-list"

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return (
    <OrganizationList
      key={params.ambito === "operacion" ? "operation-party" : "abt-supplier"}
      role={params.ambito === "operacion" ? "operation-party" : "abt-supplier"}
      searchParams={params}
    />
  )
}
