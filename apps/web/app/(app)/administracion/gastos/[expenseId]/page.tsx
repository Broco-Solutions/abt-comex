import { ExpenseDetail } from "@/features/administration/components/expense-detail"
export default async function Page({params,searchParams}:{params:Promise<{expenseId:string}>;searchParams:Promise<{returnTo?:string}>}){const [{expenseId},{returnTo}]=await Promise.all([params,searchParams]);return <ExpenseDetail id={expenseId} returnTo={returnTo}/>}
