"use client"
import { ExecutiveOverview } from "@/features/management/components/executive-overview"
import { AdministrativeAnalysis } from "./administrative-analysis"
import type { ReportingSearchParams } from "../state/use-reporting-url"
export function FinancialDashboard({
  executive = false,
  searchParams = {},
}: {
  executive?: boolean
  searchParams?: ReportingSearchParams
}) {
  return executive ? (
    <ExecutiveOverview searchParams={searchParams} />
  ) : (
    <AdministrativeAnalysis searchParams={searchParams} />
  )
}
