"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { scenarioKind } from "@/features/demo/data/scenarios"
import { useScenario } from "@/features/demo/state/scenario-provider"

const config = { count: { label: "Operaciones", color: "var(--chart-1)" } }
export function OperationSituationChart() {
  const { operations, ready } = useDemoOperations()
  const { scenario } = useScenario()
  const router = useRouter()
  const kind = scenarioKind(scenario)
  const situations = [...new Set(operations.map((item) => item.situation))]
  const data = situations.map((situation) => ({
    situation,
    count: operations.filter((item) => item.situation === situation).length,
  }))
  const href = (situation: string) => {
    const params = new URLSearchParams({ situacion: situation })
    if (kind)
      params.set("tipo", kind === "Importación" ? "importacion" : "exportacion")
    return "/operaciones?" + params.toString()
  }
  return (
    <section
      className="workspace-surface min-w-0 space-y-3 p-4"
      aria-labelledby="operation-situation-title"
    >
      <h2 id="operation-situation-title" className="text-base font-semibold">
        Operaciones por situación
      </h2>
      {!ready ? (
        <p role="status">Cargando operaciones…</p>
      ) : !operations.length ? (
        <p role="status">Sin operaciones disponibles.</p>
      ) : (
        <>
          <ChartContainer
            config={config}
            role="img"
            aria-label="Cantidad de operaciones autorizadas por situación. Desglose y enlaces debajo."
          >
            <BarChart
              data={data}
              layout="vertical"
              accessibilityLayer
              margin={{ left: 0, right: 12, top: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="situation"
                width={136}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar
                isAnimationActive={false}
                dataKey="count"
                name="Operaciones"
                fill="var(--color-count)"
                onClick={(_, index) => {
                  const item = data[index]
                  if (item) router.push(href(item.situation))
                }}
              />
            </BarChart>
          </ChartContainer>
          <ul
            aria-label="Operaciones que explican el gráfico"
            className="grid gap-x-6 sm:grid-cols-2"
          >
            {data.map((item) => (
              <li key={item.situation}>
                <Link
                  href={href(item.situation)}
                  className="flex justify-between gap-3 border-b border-border py-2 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span>{item.situation}</span>
                  <span className="font-mono">{item.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
