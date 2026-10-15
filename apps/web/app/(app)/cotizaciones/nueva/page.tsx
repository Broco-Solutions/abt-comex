import { QuoteEditor } from "@/features/quotes/components/quote-editor"

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  return (
    <QuoteEditor
      initialClientId={typeof query.cliente === "string" ? query.cliente : ""}
    />
  )
}
