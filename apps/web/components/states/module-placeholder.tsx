import { PageHeader } from "../navigation/page-header"
import { ContentUnavailableState } from "./application-state"

export function ModulePlaceholder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <ContentUnavailableState />
    </div>
  )
}
