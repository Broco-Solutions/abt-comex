"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
export function AdministrationNav() {
  const pathname = usePathname() ?? "/administracion"
  const navigation = useRef<HTMLElement>(null)
  useEffect(() => {
    const nav = navigation.current
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (
      nav &&
      current &&
      current.offsetLeft + current.offsetWidth >
        nav.scrollLeft + nav.clientWidth
    )
      nav.scrollLeft = current.offsetLeft - nav.offsetLeft
  }, [pathname])
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
    {
      href: "/administracion/comprobantes",
      label: "Comprobantes",
      show:
        hasCapability(scenario, "finance.billing") ||
        hasCapability(scenario, "finance.treasury"),
    },
    { href: "/administracion/carteras", label: "Carteras", show: movement },
  ]
  return (
    <nav
      ref={navigation}
      aria-label="Secciones de Administración"
      className="flex max-w-full gap-1 overflow-x-auto border-b border-border pb-3"
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
                "inline-flex min-h-10 shrink-0 items-center rounded-md px-3 text-sm font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-ring " +
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
