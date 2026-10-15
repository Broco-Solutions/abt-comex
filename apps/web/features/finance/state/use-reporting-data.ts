"use client"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { useAdministrativeLedger } from "@/features/administration/state/use-administrative-ledger"
import { useVouchers } from "@/features/administration/state/use-vouchers"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { useManagementRates } from "./use-management-rates"
import type { ReportInput } from "../data/reporting"

export function useReportingData() {
  const { scenario } = useScenario()
  const { state: ledger, ready: ledgerReady } = useAdministrativeLedger()
  const { state: vouchers, ready: vouchersReady } = useVouchers()
  const { organizations, ready: organizationsReady } = useOrganizations()
  const { operations, ready: operationsReady } = useDemoOperations()
  const { book, ready: ratesReady } = useManagementRates()
  const input: ReportInput = {
    scenario,
    ledger,
    vouchers,
    organizations,
    operations,
    book,
  }
  return {
    input,
    ready:
      ledgerReady &&
      vouchersReady &&
      organizationsReady &&
      operationsReady &&
      ratesReady,
  }
}
