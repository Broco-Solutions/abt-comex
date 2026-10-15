import { expect, test } from "../fixtures"

test("@smoke administration keeps financial and operational states separate and returns through context", async ({
  page,
}) => {
  await page.goto("/administracion?estado=Facturada")
  await expect(
    page.getByRole("heading", { name: "Administración y Finanzas" })
  ).toBeVisible()
  await expect(page.getByRole("row", { name: /OP-DEM-3107/ })).toBeVisible()
  await expect(
    page.getByText("Sin referencia", { exact: true }).filter({ visible: true })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Fuentes y finanzas" })
  ).toBeVisible()
  await expect(page.getByText(/\$\s?\d/)).toHaveCount(0)

  await page.getByRole("link", { name: "Abrir OP-DEM-3107" }).click()
  await expect(page).toHaveURL(/\/administracion\/op-demo-3107\?returnTo=/)
  await expect(
    page.getByRole("heading", { name: "Administración · OP-DEM-3107" })
  ).toBeVisible()
  await expect(
    page
      .getByRole("region", { name: "Contexto administrativo" })
      .getByText("Facturada", { exact: true })
  ).toBeVisible()
  await expect(page.getByText("Cobranzas")).toBeVisible()
  await expect(
    page.locator("dd").filter({ hasText: /^Pendiente$/ })
  ).toHaveCount(3)
  await expect(
    page.getByRole("button", { name: "Registrar referencia externa" })
  ).toBeDisabled()
  await page.getByRole("link", { name: "Volver a la cola" }).click()
  await expect(page).toHaveURL(/\/administracion\?estado=Facturada/)
})

test("@smoke task without an operation opens its own context and finance sources make no write promises", async ({
  page,
}) => {
  await page.goto("/administracion")
  await expect(page.getByRole("row", { name: /REN-DEM-014/ })).toBeVisible()
  await page.getByRole("link", { name: "Abrir REN-DEM-014" }).click()
  await expect(page).toHaveURL(
    /\/administracion\/finanzas\?trabajo=wrk-admin-no-operation-05/
  )
  await expect(
    page.getByText("Completar referencia de una rendición")
  ).toBeVisible()
  await expect(
    page.getByText(/sin operación vinculada y sin importes/i)
  ).toBeVisible()
  await page
    .getByText("Fuentes y definiciones pendientes", { exact: true })
    .click()
  await expect(page.getByText("Interbanking", { exact: true })).toBeVisible()
  await expect(page.getByText(/Fuera del alcance actual/)).toBeVisible()
  await expect(
    page.getByText(/Resultados, rentabilidad y márgenes no están definidos/i)
  ).toBeVisible()
})

test("@smoke administrative queue fits narrow viewports without exposing hidden economics", async ({
  page,
}) => {
  await page.goto("/administracion")
  for (const width of [1440, 1280, 1024, 820, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no page overflow at ${width}px`
    ).toBe(true)
  }
  await page.goto("/administracion?error=sin-permiso")
  await expect(
    page.getByText(/no confirma si existen elementos/i)
  ).toBeVisible()
  await expect(page.getByText("OP-DEM-3107")).toHaveCount(0)
})
