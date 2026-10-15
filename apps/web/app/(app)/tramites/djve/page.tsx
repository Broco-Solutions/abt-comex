import { DjveList } from "@/features/exportation/components/djve-list"

export default async function DjvePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const returnTo = Array.isArray(query.returnTo)
    ? query.returnTo[0]
    : query.returnTo
  return (
    <DjveList
      returnTo={returnTo}
      query={typeof query.q === "string" ? query.q : ""}
      page={typeof query.pagina === "string" ? Number(query.pagina) : 1}
    />
  )
}
