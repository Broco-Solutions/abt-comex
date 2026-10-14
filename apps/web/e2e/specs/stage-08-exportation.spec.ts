import { expect, test } from "@playwright/test"

test("@smoke exportation keeps double control separate from external customs events and returns to its operation", async ({
  page,
}) => {
  await page.goto(
    "/operaciones/op-demo-3107?returnTo=%2Foperaciones%3Ftipo%3Dexportacion"
  )
  await page.getByRole("link", { name: "Abrir espacio de Exportación" }).click()
  await expect(page).toHaveURL(
    /\/operaciones\/op-demo-3107\/exportacion\?returnTo=/
  )
  await expect(
    page.getByRole("heading", { name: "Exportación · OP-DEM-3107" })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Instrucción y provisorio" })
  ).toBeVisible()
  await expect(
    page.getByText(/Alpha2000\/MARÍA no está conectada/)
  ).toBeVisible()
  await expect(page.getByText(/Custodia física:/)).toBeVisible()
  await expect(page.getByText("Facturada", { exact: true })).toBeVisible()
  await expect(page.getByText("Pendiente", { exact: true })).toHaveCount(3)

  await page
    .getByLabel("Primera persona de demostración")
    .selectOption("demo-export-person-01")
  await page
    .getByLabel("Segunda persona de demostración")
    .selectOption("demo-export-person-02")
  await page
    .getByRole("button", { name: "Registrar control de demostración" })
    .click()
  await expect(
    page.getByText("Doble control completado en el escenario local")
  ).toBeVisible()
  await expect(
    page.getByText(/No registra una revisión real ni habilita oficialización/)
  ).toBeVisible()

  await page.getByRole("link", { name: "Volver a la operación" }).click()
  await expect(page).toHaveURL(/\/operaciones\/op-demo-3107\?returnTo=/)
  await expect(page.getByRole("heading", { name: "OP-DEM-3107" })).toBeVisible()
})

test("@smoke autonomous DJVE supports multiple permits and links back to exportation", async ({
  page,
}) => {
  await page.goto("/tramites/djve")
  await expect(
    page.getByRole("heading", { name: "DJVE y permisos" })
  ).toBeVisible()
  await page.getByLabel("Buscar DJVE o permiso").fill("DJVE-DEM-2026-01")
  await page.getByRole("link", { name: "Abrir detalle" }).first().click()
  await expect(
    page.getByRole("heading", { name: "DJVE-DEM-2026-01" })
  ).toBeVisible()
  await expect(page.getByText("Autónoma en fixture")).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Abrir Exportación vinculada" })
  ).toHaveCount(2)
  await page
    .getByRole("link", { name: "Abrir Exportación vinculada" })
    .first()
    .click()
  await expect(page).toHaveURL(
    /\/operaciones\/op-demo-3107\/exportacion\?returnTo=/
  )
  await expect(
    page.getByRole("heading", { name: "Exportación · OP-DEM-3107" })
  ).toBeVisible()
})

test("@smoke Mi trabajo opens the matching exportation workspace and preserves its return context", async ({
  page,
}) => {
  await page.goto("/mi-trabajo?trabajo=wrk-exp-post-embarque-02")
  await expect(
    page.getByText("Completar documentación de post-embarque")
  ).toBeVisible()
  await page.getByRole("link", { name: "Abrir espacio de Exportación" }).click()
  await expect(page).toHaveURL(
    /\/operaciones\/op-demo-3107\/exportacion\?returnTo=/
  )
  await page.getByRole("link", { name: "Volver a la operación" }).click()
  await expect(page).toHaveURL(
    /\/operaciones\/op-demo-3107\?returnTo=.*mi-trabajo/
  )
  await page.getByRole("link", { name: "Volver a resultados" }).click()
  await expect(page).toHaveURL(/\/mi-trabajo\?trabajo=wrk-exp-post-embarque-02/)
})

test("@smoke permission without DJVE remains visible and denial hides operation context", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-3120/exportacion")
  await expect(page.getByText("PE-DEM-1403", { exact: true })).toBeVisible()
  await expect(
    page.getByText("Sin DJVE relacionada en este escenario")
  ).toBeVisible()
  await expect(
    page.getByText(/no se calcula saldo, porcentaje ni bloqueo/i)
  ).toBeVisible()

  await page.goto("/operaciones/op-demo-3107/exportacion?error=sin-permiso")
  await expect(
    page.getByRole("heading", { name: "Exportación no disponible" })
  ).toBeVisible()
  await expect(page.getByText("OP-DEM-3107")).toHaveCount(0)
  await expect(page.getByText("Cliente Demo Norte")).toHaveCount(0)
})

test("@smoke exportation and DJVE remain usable from mobile to desktop widths", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-3107/exportacion")
  await expect(
    page.getByRole("heading", { name: "Exportación · OP-DEM-3107" })
  ).toBeVisible()
  for (const width of [1440, 1280, 1024, 960, 900, 820, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no horizontal page overflow at ${width}px`
    ).toBe(true)
  }
  await page.goto("/tramites/djve/djve-demo-2026-01")
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no horizontal page overflow at ${width}px`
    ).toBe(true)
  }
})
