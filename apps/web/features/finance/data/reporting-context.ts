import {
  analysisPresets,
  comparisonPeriod,
  presetPeriod,
  type AnalysisPeriod,
  type AnalysisPreset,
  type ComparisonMode,
} from "@workspace/ui/lib/analysis-period"
import {
  DEMONSTRATION_DATE,
  scenarioKind,
} from "@/features/demo/data/scenarios"
import { hasCapability } from "@/features/demo/data/capabilities"
import {
  REPORT_HISTORY_START,
  reportMetricLabels,
  type ReportContext,
  type ReportInput,
  type ReportMetric,
} from "./reporting"

export function reportingContext(
  params: URLSearchParams,
  input: ReportInput,
  administrative = false
) {
  const requested = params.get("periodo")
  let preset: AnalysisPreset =
    requested && requested in analysisPresets
      ? (requested as AnalysisPreset)
      : params.has("desde") || params.has("hasta") || administrative
        ? "custom"
        : "this-month"
  const fallback =
    preset === "custom"
      ? {
          from: administrative ? REPORT_HISTORY_START : "2026-10-01",
          to: DEMONSTRATION_DATE,
        }
      : presetPeriod(preset, DEMONSTRATION_DATE)
  const from = params.get("desde") ?? fallback.from,
    to = params.get("hasta") ?? fallback.to
  if (preset !== "custom" && (from !== fallback.from || to !== fallback.to))
    preset = "custom"
  const period: AnalysisPeriod = { preset, from, to }
  const comparison: ComparisonMode =
    params.get("comparacion") === "none"
      ? "none"
      : params.get("comparacion") === "year"
        ? "year"
        : "previous"
  const clientId = input.organizations.some(
    (org) =>
      org.id === params.get("cliente") &&
      org.roles.some((entry) => entry.role === "client")
  )
    ? params.get("cliente")!
    : ""
  const supplierId = input.organizations.some(
    (org) =>
      org.id === params.get("proveedor") &&
      org.roles.some((entry) => entry.role === "abt-supplier")
  )
    ? params.get("proveedor")!
    : ""
  const fixedKind = scenarioKind(input.scenario)
  const kind = hasCapability(input.scenario, "operations.read")
    ? (fixedKind ??
      (params.get("tipo") === "importacion"
        ? "Importación"
        : params.get("tipo") === "exportacion"
          ? "Exportación"
          : undefined))
    : undefined
  const context: ReportContext = {
    from,
    to,
    clientId,
    kind,
    sourceCurrency:
      params.get("moneda") === "ARS"
        ? "ARS"
        : params.get("moneda") === "USD"
          ? "USD"
          : undefined,
  }
  const requestedMetric = params.get("metrica") ?? params.get("serie")
  const metric =
    requestedMetric && requestedMetric in reportMetricLabels
      ? (requestedMetric as ReportMetric)
      : "invoice"
  return {
    period,
    comparison,
    comparePeriod: comparisonPeriod(period, comparison),
    context,
    supplierId,
    metric,
  }
}
