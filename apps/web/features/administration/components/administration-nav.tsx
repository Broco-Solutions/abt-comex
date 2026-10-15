"use client"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"

export function AdministrationNav() {
  const pathname = usePathname() ?? "/administracion"
  const params = useSearchParams()
  const router = useRouter()
  const { scenario } = useScenario()
  const expense =
    hasCapability(scenario, "finance.expenses") &&
    hasCapability(scenario, "costs.internal")
  const collections = hasCapability(scenario, "finance.collections")
  const treasury = hasCapability(scenario, "finance.treasury")
  const billing = hasCapability(scenario, "finance.billing")
  const selected = /\/(gastos|rendiciones|categorias|finanzas)(?:\/|$)/.test(
    pathname
  )
    ? "gastos"
    : pathname.includes("/movimientos")
      ? "fondos"
      : /\/(comprobantes|carteras)(?:\/|$)/.test(pathname)
        ? "cuentas"
        : "bandeja"
  const areas = [
    {
      id: "bandeja",
      label: "Bandeja administrativa",
      href: "/administracion",
      show: true,
    },
    {
      id: "gastos",
      label: "Gastos y rendiciones",
      href: "/administracion/gastos",
      show: expense,
    },
    {
      id: "fondos",
      label: "Ingresos y egresos",
      href: "/administracion/movimientos",
      show: collections || treasury,
    },
    {
      id: "cuentas",
      label: "Comprobantes y cuentas",
      href: billing
        ? "/administracion/comprobantes"
        : `/administracion/carteras?cartera=${collections ? "cobrar" : "pagar"}`,
      show: billing || collections || treasury,
    },
  ].filter((area) => area.show)
  const subviews =
    selected === "gastos"
      ? [
          { href: "/administracion/gastos", label: "Gastos", show: expense },
          {
            href: "/administracion/rendiciones",
            label: "Anticipos y rendiciones",
            show: expense && treasury,
          },
          {
            href: "/administracion/finanzas",
            label: "Gastos por categoría y vencimientos",
            show: expense || collections,
          },
        ]
      : selected === "cuentas"
        ? [
            {
              href: "/administracion/comprobantes",
              label: "Comprobantes",
              show: billing || treasury,
            },
            {
              href: "/administracion/carteras?cartera=cobrar",
              label: "Cuentas por cobrar",
              show: collections,
            },
            {
              href: "/administracion/carteras?cartera=pagar",
              label: "Cuentas por pagar",
              show: treasury,
            },
          ]
        : []
  return (
    <div className="space-y-3 border-b border-border pb-3">
      <label className="grid gap-1 text-xs font-medium md:hidden">
        Área administrativa
        <select
          aria-label="Área administrativa"
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={selected}
          onChange={(event) => {
            const area = areas.find((item) => item.id === event.target.value)
            if (area) router.push(area.href, { scroll: false })
          }}
        >
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.label}
            </option>
          ))}
        </select>
      </label>
      <nav
        aria-label="Secciones de Administración"
        className="hidden gap-1 md:grid md:grid-cols-2 xl:grid-cols-4"
      >
        {areas.map((area) => (
          <Link
            key={area.id}
            href={area.href}
            scroll={false}
            aria-current={selected === area.id ? "location" : undefined}
            className={
              "flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring " +
              (selected === area.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground")
            }
          >
            {area.label}
          </Link>
        ))}
      </nav>
      {subviews.some((item) => item.show) && (
        <nav
          aria-label="Vistas del área administrativa"
          className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
        >
          {subviews
            .filter((item) => item.show)
            .map((item) => {
              const url = new URL(item.href, "https://local.invalid")
              const active =
                (pathname === url.pathname ||
                  pathname.startsWith(url.pathname + "/")) &&
                (!url.searchParams.has("cartera") ||
                  (params?.get("cartera") ?? "cobrar") ===
                    url.searchParams.get("cartera"))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={
                    "inline-flex min-h-10 items-center border-b-2 py-1 focus-visible:outline-2 focus-visible:outline-ring " +
                    (active
                      ? "border-primary font-semibold text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground")
                  }
                >
                  {item.label}
                </Link>
              )
            })}
        </nav>
      )}
    </div>
  )
}
