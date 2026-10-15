"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
export function AdministrationNav() {
  const pathname = usePathname() ?? "/administracion"
  const { scenario } = useScenario()
  const expense =
    hasCapability(scenario, "finance.expenses") &&
    hasCapability(scenario, "costs.internal")
  const movement =
    hasCapability(scenario, "finance.collections") ||
    hasCapability(scenario, "finance.treasury")
  const entries = [
    { href: "/administracion", label: "Pases", show: true },
    { href: "/administracion/gastos", label: "Gastos", show: expense },
    {
      href: "/administracion/movimientos",
      label: "Movimientos",
      show: movement,
    },
    {
      href: "/administracion/rendiciones",
      label: "Rendiciones",
      show: expense && hasCapability(scenario, "finance.treasury"),
    },
    { href: "/administracion/finanzas", label: "Análisis", show: true },
  ]
  return (
    <nav
      aria-label="Secciones de Administración"
      className="flex flex-wrap gap-1 border-b border-border pb-3"
    >
      {entries
        .filter((item) => item.show)
        .map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/administracion" &&
              pathname.startsWith(item.href + "/"))
          return (
            <Link
              key={item.href}
              href={item.href}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={
                "inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring " +
                (active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              {item.label}
            </Link>
          )
        })}
    </nav>
  )
}
