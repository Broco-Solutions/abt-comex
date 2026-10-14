import { Worklist } from "@/features/work/components/worklist"

type MiTrabajoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function MiTrabajoPage({
  searchParams,
}: MiTrabajoPageProps) {
  return <Worklist searchParams={await searchParams} />
}
