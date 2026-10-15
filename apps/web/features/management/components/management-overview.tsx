"use client"

import Link from "next/link"
import { FinancialDashboard } from "@/features/finance/components/financial-dashboard"
import { formatRecordedDate } from "@workspace/ui/lib/date"

import { PageHeader } from "@/components/navigation/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { demonstrationClients } from "@/features/clients/data/clients"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { useWorkItems } from "@/features/work/state/use-work-items"
import {
  getManagementSnapshot,
  managementSourceFamilies,
} from "../data/management"

type SearchParams = Record<string, string | string[] | undefined>
type ManagementView =
  | "resumen"
  | "operaciones"
  | "clientes"
  | "trabajo"
  | "economia"
const views: Array<[ManagementView, string]> = [
  ["resumen", "Panorama"],
  ["operaciones", "Operación"],
  ["clientes", "Clientes"],
  ["trabajo", "Carga y vencimientos"],
  ["economia", "Fuentes económicas"],
]

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function operationHref(
  kind: "Importación" | "Exportación",
  situation?: string
) {
  const params = new URLSearchParams({
    tipo: kind === "Importación" ? "importacion" : "exportacion",
  })
  if (situation) params.set("situacion", situation)
  return `/operaciones?${params.toString()}`
}

export function ManagementOverview({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { operations, ready } = useDemoOperations()
  const workItems = useWorkItems()
  const view = views.some(([key]) => key === first(searchParams.vista))
    ? (first(searchParams.vista) as ManagementView)
    : "resumen"
  const restricted = first(searchParams.error) === "sin-permiso"
  const readError = first(searchParams.error) === "lectura"

  if (!ready)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )

  if (view === "resumen" && !restricted && !readError)
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dirección"
          secondaryActions={
            <Link
              href="/administracion/finanzas"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Finanzas
            </Link>
          }
        />
        <FinancialDashboard executive searchParams={searchParams} />
        <Link
          href="/gestion?vista=economia"
          className="text-sm text-primary underline underline-offset-4"
        >
          Fuentes y definiciones pendientes
        </Link>
      </div>
    )

  const snapshot = getManagementSnapshot(
    operations,
    demonstrationClients,
    workItems
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dirección"
        secondaryActions={
          <Link
            href="/administracion/finanzas"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Fuentes administrativas
          </Link>
        }
      />

      <nav
        aria-label="Consultas históricas de Dirección"
        className="flex gap-2 overflow-x-auto border-b border-border pb-3"
      >
        {views.map(([key, label]) => (
          <Link
            key={key}
            href={`/gestion?vista=${key}`}
            aria-current={view === key ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: view === key ? "secondary" : "outline",
                size: "sm",
              }),
              "min-h-9 shrink-0"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
      <p className="-mt-4 text-xs text-muted-foreground sm:hidden">
        Deslizá horizontalmente para ver todas las vistas.
      </p>

      {restricted || readError ? (
        <section
          role={restricted ? "status" : "alert"}
          className="max-w-3xl border-y border-border py-5"
        >
          <h2 className="font-semibold">
            {restricted
              ? "Información de Gestión no disponible"
              : "No se pudo leer la fuente"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {restricted
              ? "Esta vista no confirma si existen registros o métricas."
              : "Se conservaron los filtros. No se muestra un conteo que no pudo confirmarse."}
          </p>
          <Link
            href={`/gestion?vista=${view}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-3"
            )}
          >
            Reintentar lectura
          </Link>
        </section>
      ) : (
        <>
          <section
            className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-3"
            aria-label="Procedencia del panorama"
          >
            <p className="text-sm">ABT Comex · registros locales.</p>
            <p className="text-xs text-muted-foreground">
              Actualización: 14/10/2026 · sin consulta externa.
            </p>
          </section>

          {view === "resumen" ? <OverviewTable snapshot={snapshot} /> : null}
          {view === "operaciones" ? (
            <OperationsView snapshot={snapshot} />
          ) : null}
          {view === "clientes" ? <ClientsView snapshot={snapshot} /> : null}
          {view === "trabajo" ? <WorkView snapshot={snapshot} /> : null}
          {view === "economia" ? <EconomyView /> : null}
        </>
      )}
    </div>
  )
}

function OverviewTable({
  snapshot,
}: {
  snapshot: ReturnType<typeof getManagementSnapshot>
}) {
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="management-snapshot-title"
        className="space-y-3"
      >
        <div>
          <h2 id="management-snapshot-title" className="text-lg font-semibold">
            Cobertura del escenario operativo
          </h2>
        </div>
        <dl className="grid gap-x-8 gap-y-3 border-y border-border py-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">
              Operaciones sintéticas
            </dt>
            <dd className="mt-1 font-semibold">{snapshot.operationCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Importación / Exportación
            </dt>
            <dd className="mt-1 font-semibold">
              {snapshot.importCount} / {snapshot.exportCount}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Clientes del escenario
            </dt>
            <dd className="mt-1 font-semibold">{snapshot.clientCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Elementos de trabajo
            </dt>
            <dd className="mt-1 font-semibold">{snapshot.workCount}</dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby="management-next-title" className="space-y-3">
        <div>
          <h2 id="management-next-title" className="text-lg font-semibold">
            Qué conviene explorar
          </h2>
          <p className="text-sm text-muted-foreground">
            La siguiente acción abre registros fuente. Los números no son
            indicadores aprobados.
          </p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          <p className="py-3 text-sm">
            Situaciones por operación, con filtros y ficha común.{" "}
            <Link
              href="/gestion?vista=operaciones"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Abrir desglose
            </Link>
          </p>
          <p className="py-3 text-sm">
            Clientes y operaciones relacionadas, sin agregados comerciales.{" "}
            <Link
              href="/gestion?vista=clientes"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Abrir actividad
            </Link>
          </p>
          <p className="py-3 text-sm">
            Pendientes, responsables y vencimientos del fixture.{" "}
            <Link
              href="/gestion?vista=trabajo"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Abrir carga
            </Link>
          </p>
          <p className="py-3 text-sm">
            Indicadores económicos: fuente, fórmula y permisos todavía sin
            validar.{" "}
            <Link
              href="/gestion?vista=economia"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Consultar límites
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

function OperationsView({
  snapshot,
}: {
  snapshot: ReturnType<typeof getManagementSnapshot>
}) {
  return (
    <section aria-labelledby="operation-breakdown-title" className="space-y-3">
      <div>
        <h2 id="operation-breakdown-title" className="text-lg font-semibold">
          Situación de operaciones
        </h2>
      </div>
      <p className="text-xs text-muted-foreground sm:hidden">
        Desplazá la tabla horizontalmente para ver todas las columnas.
      </p>
      <div
        role="region"
        aria-label="Situación de operaciones, tabla desplazable horizontalmente"
        tabIndex={0}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="sr-only">
            Operaciones del escenario por tipo y situación
          </caption>
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">
                Tipo
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Situación
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Filas sintéticas
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Detalle
              </th>
            </tr>
          </thead>
          <tbody>
            {snapshot.statusGroups.map((group) => (
              <tr
                key={`${group.kind}-${group.situation}`}
                className="border-b last:border-0"
              >
                <th scope="row" className="px-3 py-3 font-medium">
                  {group.kind}
                </th>
                <td className="px-3 py-3">
                  <Badge variant="outline">{group.situation}</Badge>
                </td>
                <td className="px-3 py-3">{group.count}</td>
                <td className="px-3 py-3">
                  <Link
                    href={operationHref(group.kind, group.situation)}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Abrir operaciones
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Fuente: fixtures locales de Operaciones. No conectados: Alpha2000/MARÍA
        y fuentes aduaneras. Fechas y estados no se verifican externamente.
      </p>
    </section>
  )
}

function ClientsView({
  snapshot,
}: {
  snapshot: ReturnType<typeof getManagementSnapshot>
}) {
  return (
    <section aria-labelledby="client-activity-title" className="space-y-3">
      <div>
        <h2 id="client-activity-title" className="text-lg font-semibold">
          Actividad relacionada con clientes
        </h2>
      </div>
      <p className="text-xs text-muted-foreground sm:hidden">
        Desplazá la tabla horizontalmente para ver todas las columnas.
      </p>
      <div
        role="region"
        aria-label="Actividad de clientes, tabla desplazable horizontalmente"
        tabIndex={0}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <table className="w-full min-w-[32rem] text-left text-sm">
          <caption className="sr-only">
            Clientes sintéticos y operaciones relacionadas
          </caption>
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">
                Cliente
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Operaciones relacionadas
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Detalle
              </th>
            </tr>
          </thead>
          <tbody>
            {snapshot.clientActivity.map(({ client, operations }) => (
              <tr key={client.id} className="border-b last:border-0">
                <th scope="row" className="px-3 py-3 font-medium">
                  {client.name}
                </th>
                <td className="px-3 py-3">{operations}</td>
                <td className="px-3 py-3">
                  <Link
                    href={`/clientes/${client.id}?returnTo=${encodeURIComponent("/gestion?vista=clientes")}`}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Abrir cliente
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function WorkView({
  snapshot,
}: {
  snapshot: ReturnType<typeof getManagementSnapshot>
}) {
  return (
    <section aria-labelledby="workload-title" className="space-y-3">
      <div>
        <h2 id="workload-title" className="text-lg font-semibold">
          Carga de trabajo y vencimientos
        </h2>
      </div>
      <dl className="grid gap-x-8 gap-y-3 border-y border-border py-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Pendientes</dt>
          <dd className="mt-1 font-semibold">{snapshot.workCount}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Marcados vencidos</dt>
          <dd className="mt-1 font-semibold">{snapshot.overdueCount}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            Sin responsable informado
          </dt>
          <dd className="mt-1 font-semibold">{snapshot.unassignedCount}</dd>
        </div>
      </dl>
      <div className="divide-y divide-border border-b border-border">
        {snapshot.workItems.map((item) => (
          <article
            key={item.id}
            className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_10rem_auto] sm:items-center"
          >
            <div>
              <h3 className="text-sm font-medium">{item.title}</h3>
              <p className="text-xs text-muted-foreground">
                {item.reference} · {item.origin}
              </p>
            </div>
            <p className="text-sm">
              {item.owner ?? "Sin responsable informado"}
              <span className="block text-xs text-muted-foreground">
                {item.dueDate
                  ? formatRecordedDate(item.dueDate)
                  : "Sin vencimiento informado"}
              </span>
            </p>
            <Link
              href={`/mi-trabajo?q=${encodeURIComponent(item.reference)}&trabajo=${encodeURIComponent(item.id)}`}
              className="min-h-9 self-center text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Abrir contexto
            </Link>
          </article>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Los vencimientos son fechas fijas del escenario de demostración. Sin
        conexión a un calendario o fuente de tareas externa.
      </p>
    </section>
  )
}

function EconomyView() {
  return (
    <section aria-labelledby="economy-limits-title" className="space-y-3">
      <div>
        <h2 id="economy-limits-title" className="text-lg font-semibold">
          Información económica: fuentes y límites
        </h2>
        <p className="text-sm text-muted-foreground">
          No se presentan resultados, totales, saldos, costos ni márgenes porque
          sus fuentes, definiciones y permisos no están validados.
        </p>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {managementSourceFamilies.map((item) => (
          <article
            key={item.id}
            className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)]"
          >
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.source}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline">Pendiente</Badge>
              <div>
                <p className="text-sm text-muted-foreground">{item.state}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Responsable de validación: {item.validationOwner}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm">
        La matriz documental conserva las 18 categorías históricas
        REP-001–REP-018; esta vista no replica el workbook ni sus datos.
      </p>
      <p className="border-t border-border pt-3 text-xs text-muted-foreground">
        Cada futura métrica requiere propósito, definición, fórmula aprobada,
        período, moneda, fuente, fecha de actualización, permisos y responsable
        de validación. Ser responsable operativo no concede acceso a honorarios,
        costos internos ni márgenes. Los permisos mock no son seguridad
        productiva.
      </p>
      <Link
        href="/administracion/finanzas"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Ver dependencias administrativas
      </Link>
    </section>
  )
}
