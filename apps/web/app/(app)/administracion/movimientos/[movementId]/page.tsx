import { MovementDetail } from "@/features/administration/components/movement-detail"
export default async function Page({params,searchParams}:{params:Promise<{movementId:string}>;searchParams:Promise<{returnTo?:string}>}){const [{movementId},{returnTo}]=await Promise.all([params,searchParams]);return <MovementDetail id={movementId} returnTo={returnTo}/>}
