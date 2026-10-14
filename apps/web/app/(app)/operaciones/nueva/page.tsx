import { OperationCreation } from "@/features/operations/components/operation-creation"

export default async function NewOperationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <OperationCreation searchParams={await searchParams} />
}
