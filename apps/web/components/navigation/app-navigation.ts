import type { LucideIcon } from "lucide-react"
import {
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardList,
  FileText,
  House,
  Settings,
} from "lucide-react"

export type NavigationItem = {
  id: string
  label: string
  href: string
  description: string
  icon?: LucideIcon
  children?: NavigationItem[]
  separatorAfter?: boolean
}

export type BreadcrumbItem = {
  label: string
  href?: string
  current: boolean
}

export const appNavigation: NavigationItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/inicio",
    description: "Punto de entrada al trabajo diario.",
    icon: House,
  },
  {
    id: "mi-trabajo",
    label: "Mi trabajo",
    href: "/mi-trabajo",
    description: "Trabajo accionable y asignaciones.",
    icon: BriefcaseBusiness,
    separatorAfter: true,
  },
  {
    id: "operaciones",
    label: "Operaciones",
    href: "/operaciones",
    description: "Núcleo de importaciones y exportaciones.",
    icon: ClipboardList,
    children: [
      {
        id: "operaciones-importaciones",
        label: "Importaciones",
        href: "/operaciones?tipo=importacion",
        description: "Operaciones de importación.",
      },
      {
        id: "operaciones-exportaciones",
        label: "Exportaciones",
        href: "/operaciones?tipo=exportacion",
        description: "Operaciones de exportación.",
      },
    ],
  },
  {
    id: "clientes",
    label: "Clientes",
    href: "/clientes",
    description: "Contexto persistente de clientes.",
    icon: Building2,
    children: [
      {
        id: "clientes-cotizaciones",
        label: "Cotizaciones",
        href: "/cotizaciones",
        description: "Cotizaciones vinculadas al circuito comercial.",
        icon: FileText,
      },
    ],
  },
  {
    id: "proveedores",
    label: "Proveedores",
    href: "/proveedores",
    description:
      "Proveedores contratados por ABT y contrapartes diferenciadas.",
    icon: Building2,
  },
  {
    id: "administracion",
    label: "Administración y Finanzas",
    href: "/administracion",
    description: "Continuidad administrativa de las operaciones.",
    icon: CircleDollarSign,
  },
  {
    id: "gestion",
    label: "Dirección",
    href: "/gestion",
    description: "Información para seguimiento y dirección.",
    icon: ChartNoAxesCombined,
  },
  {
    id: "configuracion",
    label: "Configuración",
    href: "/configuracion",
    description: "Parámetros del producto cuando sean definidos.",
    icon: Settings,
  },
]

function normalizedPathname(pathname: string) {
  if (pathname === "/") return pathname
  return pathname.replace(/\/$/, "")
}

export function resolveActiveNavigation(
  pathname: string,
  searchParams: URLSearchParams | Readonly<URLSearchParams>
): string | null {
  const path = normalizedPathname(pathname)

  if (path === "/operaciones") {
    const operationType = searchParams.get("tipo")
    if (operationType === "importacion") return "operaciones-importaciones"
    if (operationType === "exportacion") return "operaciones-exportaciones"
    return "operaciones"
  }

  for (const item of appNavigation) {
    if (
      path === item.href ||
      (path.startsWith(`${item.href}/`) && item.href !== "/")
    ) {
      return item.id
    }
    const child = item.children?.find(
      (entry) =>
        path === entry.href ||
        (path.startsWith(`${entry.href}/`) && entry.href !== "/")
    )
    if (child) return child.id
  }
  return null
}

export function buildBreadcrumbs(
  pathname: string,
  searchParams: URLSearchParams | Readonly<URLSearchParams>
): BreadcrumbItem[] {
  const activeId = resolveActiveNavigation(pathname, searchParams)
  if (!activeId) return []

  for (const item of appNavigation) {
    if (item.id === activeId) {
      return [{ label: item.label, current: true }]
    }

    const child = item.children?.find((entry) => entry.id === activeId)
    if (child) {
      return [
        { label: item.label, href: item.href, current: false },
        { label: child.label, current: true },
      ]
    }
  }

  return []
}

export function findNavigationItem(id: string | null) {
  if (!id) return null
  for (const item of appNavigation) {
    if (item.id === id) return item
    const child = item.children?.find((entry) => entry.id === id)
    if (child) return child
  }
  return null
}
