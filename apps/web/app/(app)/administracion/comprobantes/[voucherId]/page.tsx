import { VoucherDetail } from "@/features/administration/components/voucher-detail"
export default async function Page({params,searchParams}:{params:Promise<{voucherId:string}>;searchParams:Promise<{returnTo?:string}>}){const [{voucherId},{returnTo}]=await Promise.all([params,searchParams]);return <VoucherDetail id={voucherId} returnTo={returnTo}/>}
