import { QuoteDetail } from "@/features/quotes/components/quote-detail"

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ quoteId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ quoteId }, query] = await Promise.all([params, searchParams])
  return <QuoteDetail quoteId={quoteId} searchParams={query} />
}
