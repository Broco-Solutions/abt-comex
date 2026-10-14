import { QuotesList } from "@/features/quotes/components/quotes-list"
import type { QuoteSearchParams } from "@/features/quotes/data/quotes"

export default async function CotizacionesPage({
  searchParams,
}: {
  searchParams: Promise<QuoteSearchParams>
}) {
  return <QuotesList searchParams={await searchParams} />
}
