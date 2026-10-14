import { DjveDetail } from "@/features/exportation/components/djve-detail"

export default async function DjveDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ djveId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ djveId }, query] = await Promise.all([params, searchParams])
  const returnTo = Array.isArray(query.returnTo)
    ? query.returnTo[0]
    : query.returnTo
  const restricted = Array.isArray(query.error)
    ? query.error[0] === "sin-permiso"
    : query.error === "sin-permiso"
  return (
    <DjveDetail djveId={djveId} returnTo={returnTo} restricted={restricted} />
  )
}
