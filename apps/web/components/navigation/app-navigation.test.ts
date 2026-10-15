import { describe, expect, it } from "vitest"

import {
  appNavigation,
  buildBreadcrumbs,
  resolveActiveNavigation,
} from "./app-navigation"

describe("appNavigation", () => {
  it("keeps Inicio and Mi trabajo as consecutive top-level destinations", () => {
    expect(appNavigation.slice(0, 3).map((item) => item.id)).toEqual([
      "inicio",
      "mi-trabajo",
      "operaciones",
    ])
    expect(appNavigation[1]).toMatchObject({
      href: "/mi-trabajo",
      separatorAfter: true,
    })
    expect(appNavigation[0]?.children).toBeUndefined()
    expect(appNavigation[1]?.children).toBeUndefined()
  })
})

describe("resolveActiveNavigation", () => {
  it.each([
    ["/inicio", "", "inicio"],
    ["/mi-trabajo", "", "mi-trabajo"],
    ["/clientes", "", "clientes"],
    ["/cotizaciones", "", "clientes-cotizaciones"],
    ["/operaciones", "", "operaciones"],
    ["/operaciones", "tipo=importacion", "operaciones-importaciones"],
    [
      "/operaciones",
      "tipo=exportacion&vista=compacta",
      "operaciones-exportaciones",
    ],
    ["/operaciones", "tipo=no-definido", "operaciones"],
  ])("resolves %s?%s as %s", (pathname, query, expected) => {
    expect(resolveActiveNavigation(pathname, new URLSearchParams(query))).toBe(
      expected
    )
  })

  it("returns null outside the application navigation", () => {
    expect(
      resolveActiveNavigation("/design-system", new URLSearchParams())
    ).toBeNull()
  })
})

describe("buildBreadcrumbs", () => {
  it("does not invent hierarchy for a first-level section", () => {
    expect(buildBreadcrumbs("/clientes", new URLSearchParams())).toEqual([
      { label: "Clientes", current: true },
    ])
  })

  it("keeps Mi trabajo as a first-level breadcrumb", () => {
    expect(buildBreadcrumbs("/mi-trabajo", new URLSearchParams())).toEqual([
      { label: "Mi trabajo", current: true },
    ])
  })

  it("represents an operation variant below Operaciones", () => {
    expect(
      buildBreadcrumbs("/operaciones", new URLSearchParams("tipo=importacion"))
    ).toEqual([
      { label: "Operaciones", href: "/operaciones", current: false },
      { label: "Importaciones", current: true },
    ])
  })

  it("keeps the complete operations view at the first breadcrumb level", () => {
    expect(buildBreadcrumbs("/operaciones", new URLSearchParams())).toEqual([
      { label: "Operaciones", current: true },
    ])
  })

  it("keeps Cotizaciones directly reachable below the client relationship", () => {
    expect(
      buildBreadcrumbs("/cotizaciones", new URLSearchParams())
    ).toEqual([
      { label: "Clientes", href: "/clientes", current: false },
      { label: "Cotizaciones", current: true },
    ])
  })
})
