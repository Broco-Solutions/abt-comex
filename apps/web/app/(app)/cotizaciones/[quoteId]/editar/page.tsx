import { QuoteEditor } from "@/features/quotes/components/quote-editor"

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ quoteId: string }>
}) {
  const { quoteId } = await params
  return <QuoteEditor quoteId={quoteId} />
}
