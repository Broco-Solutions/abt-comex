import { MemberDetail } from "@/features/people/components/member-detail"
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ memberId: string }>
  searchParams: Promise<{ returnTo?: string }>
}) {
  const { memberId } = await params
  const { returnTo } = await searchParams
  return <MemberDetail id={memberId} returnTo={returnTo} />
}
