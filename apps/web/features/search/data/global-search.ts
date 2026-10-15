import { appNavigation } from "@/components/navigation/app-navigation"
import { hasCapability } from "@/features/demo/data/capabilities"
import {
  canVisit,
  scenarioKind,
  type Scenario,
} from "@/features/demo/data/scenarios"
import type { Organization } from "@/features/organizations/data/organizations"
import type { DemonstrationOperation } from "@/features/operations/types/operation"
import type { DemonstrationQuote } from "@/features/quotes/types/quote"
import { getCurrentQuoteVersion } from "@/features/quotes/data/quotes"

export const searchGroups = [
  "Operaciones",
  "Cotizaciones",
  "Clientes",
  "Proveedores",
  "Pantallas",
] as const
export type SearchResult = {
  id: string
  group: (typeof searchGroups)[number]
  title: string
  context: string
  href: string
  record: boolean
}
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-AR")
    .trim()

export function buildSearchIndex({
  scenario,
  operations,
  quotes,
  organizations,
}: {
  scenario: Scenario
  operations: DemonstrationOperation[]
  quotes: DemonstrationQuote[]
  organizations: Organization[]
}): SearchResult[] {
  if (scenario.id === "client") return []
  const kind = scenarioKind(scenario)
  const result: SearchResult[] = []
  const name = (id: string) =>
    organizations.find((item) => item.id === id)?.name
  if (hasCapability(scenario, "operations.read"))
    for (const operation of operations) {
      if (kind && operation.kind !== kind) continue
      result.push({
        id: `operation:${operation.id}`,
        group: "Operaciones",
        title: operation.reference,
        context: `${name(operation.clientId) ?? operation.client} · ${operation.kind} · ${operation.situation}`,
        href: `/operaciones/${operation.id}`,
        record: true,
      })
    }
  if (hasCapability(scenario, "commercial.read"))
    for (const quote of quotes) {
      const version = getCurrentQuoteVersion(quote)
      result.push({
        id: `quote:${quote.id}`,
        group: "Cotizaciones",
        title: quote.reference,
        context: `${name(quote.clientId) ?? "Cliente pendiente"} · v${version.number} · ${version.service}`,
        href: `/cotizaciones/${quote.id}`,
        record: true,
      })
    }
  for (const organization of organizations) {
    const client = organization.roles.find((entry) => entry.role === "client")
    const supplier = organization.roles.find(
      (entry) => entry.role === "abt-supplier"
    )
    if (!client && !supplier) continue
    const href = client
      ? `/clientes/${organization.id}`
      : `/proveedores/${organization.id}`
    if (!canVisit(scenario, href)) continue
    result.push({
      id: `organization:${organization.id}`,
      group: client ? "Clientes" : "Proveedores",
      title: organization.name,
      context: [
        client ? "Cliente" : "Proveedor de ABT",
        client && supplier ? "Proveedor de ABT" : "",
        organization.country,
        organization.taxReference,
        !(client ?? supplier)?.active ? "Inactivo" : "",
      ]
        .filter(Boolean)
        .join(" · "),
      href,
      record: true,
    })
  }
  const pages = appNavigation
    .flatMap((item) => [
      { title: item.label, href: item.href },
      ...(item.children ?? []).map((child) => ({
        title: `${item.label} › ${child.label}`,
        href: child.href,
      })),
    ])
    .filter(
      (page) =>
        canVisit(scenario, page.href.split("?")[0]!) &&
        (!kind ||
          !page.href.includes("tipo=") ||
          page.href.includes(
            kind === "Importación" ? "importacion" : "exportacion"
          ))
    )
  const expense =
    hasCapability(scenario, "finance.expenses") &&
    hasCapability(scenario, "costs.internal")
  const collections = hasCapability(scenario, "finance.collections")
  const treasury = hasCapability(scenario, "finance.treasury")
  const billing = hasCapability(scenario, "finance.billing")
  const administrative = [
    [
      "Bandeja administrativa",
      "/administracion",
      canVisit(scenario, "/administracion"),
    ],
    ["Gastos y rendiciones", "/administracion/gastos", expense],
    [
      "Anticipos y rendiciones",
      "/administracion/rendiciones",
      expense && treasury,
    ],
    [
      "Ingresos y egresos",
      "/administracion/movimientos",
      collections || treasury,
    ],
    ["Comprobantes", "/administracion/comprobantes", billing || treasury],
    [
      "Cuentas por cobrar",
      "/administracion/carteras?cartera=cobrar",
      collections,
    ],
    ["Cuentas por pagar", "/administracion/carteras?cartera=pagar", treasury],
  ] as const
  for (const [title, href, show] of administrative)
    if (show)
      pages.push({ title: `Administración y Finanzas › ${title}`, href })
  for (const [title, href] of [
    ["Personas y acceso", "/configuracion/personas"],
    ["Equipos y responsables", "/configuracion/equipos"],
    ["Categorías y conceptos", "/configuracion/categorias"],
    ["Cotizaciones de gestión", "/configuracion/cotizaciones-gestion"],
  ]) {
    if (canVisit(scenario, href!))
      pages.push({ title: `Configuración › ${title}`, href: href! })
  }
  for (const page of pages)
    result.push({
      id: `page:${page.href}:${page.title}`,
      group: "Pantallas",
      title: page.title,
      context: "Ir a pantalla",
      href: page.href,
      record: false,
    })
  return result
}

export function searchIndex(index: SearchResult[], query: string) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return index.filter((item) => !item.record).slice(0, 8)
  return index.filter((item) =>
    terms.every((term) =>
      normalizeSearch(`${item.title} ${item.context}`).includes(term)
    )
  )
}
