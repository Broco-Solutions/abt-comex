import { OrganizationDetail } from "@/features/organizations/components/organization-detail"

export default async function SupplierPage({
  params,
  searchParams,
}: {
  params: Promise<{ organizationId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ organizationId }, query] = await Promise.all([params, searchParams])
  return (
    <OrganizationDetail
      organizationId={organizationId}
      returnTo={typeof query.returnTo === "string" ? query.returnTo : ""}
    />
  )
}
