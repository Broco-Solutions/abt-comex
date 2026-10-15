"use client"
import { AnalysisPeriodPicker } from "@workspace/ui/components/analysis-period-picker"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { formatDate } from "@workspace/ui/lib/date"
import {
  DEMONSTRATION_DATE,
  scenarioKind,
} from "@/features/demo/data/scenarios"
import { hasCapability } from "@/features/demo/data/capabilities"
import { reportingContext } from "../data/reporting-context"
import { REPORT_HISTORY_START, type ReportInput } from "../data/reporting"

export const reportControl =
  "h-9 min-w-0 rounded-md border border-input bg-background px-2 text-sm font-normal focus-visible:outline-2 focus-visible:outline-ring max-sm:min-h-11"
export function ReportFilters({
  input,
  params,
  change,
  administrative = false,
  consultations = false,
}: {
  input: ReportInput
  params: URLSearchParams
  change: (patch: Record<string, string | undefined>, replace?: boolean) => void
  administrative?: boolean
  consultations?: boolean
}) {
  const state = reportingContext(params, input, administrative)
  const fixedKind = scenarioKind(input.scenario)
  const clients = input.organizations.filter((organization) =>
    organization.roles.some((entry) => entry.role === "client")
  )
  return (
    <section
      aria-label="Filtros del análisis"
      className="workspace-surface space-y-2 p-3 sm:p-4"
    >
      <AnalysisPeriodPicker
        value={state.period}
        reference={DEMONSTRATION_DATE}
        onChange={(period) =>
          change({
            periodo: period.preset,
            desde: period.from,
            hasta: period.to,
            serie: undefined,
            dimension: undefined,
            grupo: undefined,
          })
        }
      >
        {!administrative && !consultations && (
          <label className="grid min-w-0 gap-1 text-xs font-medium">
            Comparar con
            <select
              aria-label="Comparar con"
              className={reportControl}
              value={state.comparison}
              onChange={(event) => change({ comparacion: event.target.value })}
            >
              <option value="previous">Período anterior</option>
              <option value="year">Mismo período del año anterior</option>
              <option value="none">Sin comparación</option>
            </select>
          </label>
        )}
        <div className="w-full min-w-0 sm:w-56">
          <SearchableCombobox
            label="Cliente"
            value={state.context.clientId ?? ""}
            onChange={(clientId) =>
              change({
                cliente: clientId,
                serie: undefined,
                dimension: undefined,
                grupo: undefined,
              })
            }
            options={[
              { value: "", label: "Todos los clientes" },
              ...clients.map((organization) => ({
                value: organization.id,
                label: organization.name,
              })),
            ]}
          />
        </div>
        {hasCapability(input.scenario, "operations.read") && !fixedKind && (
          <label className="grid min-w-0 gap-1 text-xs font-medium">
            Tipo de operación
            <select
              aria-label="Tipo de operación"
              className={reportControl}
              value={params.get("tipo") ?? ""}
              onChange={(event) =>
                change({
                  tipo: event.target.value,
                  serie: undefined,
                  dimension: undefined,
                  grupo: undefined,
                })
              }
            >
              <option value="">Todos</option>
              <option value="importacion">Importación</option>
              <option value="exportacion">Exportación</option>
            </select>
          </label>
        )}
        <details
          className="min-w-0"
          open={state.context.sourceCurrency ? true : undefined}
        >
          <summary
            className={`${reportControl} flex cursor-pointer items-center`}
          >
            Moneda de origen
            {state.context.sourceCurrency
              ? `: ${state.context.sourceCurrency}`
              : ""}
          </summary>
          <label className="mt-2 grid gap-1 text-xs font-medium">
            Filtrar moneda original
            <select
              aria-label="Filtrar moneda original"
              className={reportControl}
              value={state.context.sourceCurrency ?? ""}
              onChange={(event) =>
                change({
                  moneda: event.target.value,
                  serie: undefined,
                  dimension: undefined,
                  grupo: undefined,
                })
              }
            >
              <option value="">Todas · reporte USD</option>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </label>
        </details>
      </AnalysisPeriodPicker>
      {!administrative && !consultations && state.comparePeriod && (
        <p className="text-xs text-muted-foreground">
          Comparación: {formatDate(state.comparePeriod.from)}–
          {formatDate(state.comparePeriod.to)}
          {!state.comparePeriod.comparable
            ? " · distinta duración; sin variación porcentual"
            : " · corte equivalente"}
          {state.comparePeriod.from < REPORT_HISTORY_START
            ? " · sin historia suficiente"
            : ""}
        </p>
      )}
      {state.context.kind && (
        <p className="text-xs text-muted-foreground">
          {state.context.kind}: importes de registros vinculados a ese tipo de
          operación, sin prorratear registros compartidos.
        </p>
      )}
    </section>
  )
}
