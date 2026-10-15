import { RenditionDetail } from "@/features/administration/components/rendition-detail"
export default async function Page({params,searchParams}:{params:Promise<{renditionId:string}>;searchParams:Promise<{returnTo?:string}>}){const [{renditionId},{returnTo}]=await Promise.all([params,searchParams]);return <RenditionDetail id={renditionId} returnTo={returnTo}/>}
