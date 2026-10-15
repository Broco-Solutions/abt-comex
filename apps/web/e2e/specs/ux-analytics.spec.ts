import { test, expect } from "../fixtures"

test("@smoke Direction charts drill into identical records and keep period and currency", async ({
  page,
}) => {
  await page.goto("/gestion?desde=2026-10-01&hasta=2026-10-14&moneda=ARS")
  await expect(
    page.getByRole("heading", { name: "Dirección", exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Facturación y cobranzas por mes" })
  ).toBeVisible()
  await page
    .getByText("Ver valores y registros por mes", { exact: true })
    .click()
  await page.getByRole("link", { name: /Facturación oct/ }).click()
  await expect(page).toHaveURL(
    /moneda=ARS.*serie=invoice.*dimension=month.*grupo=2026-10/
  )
  const records = page.getByRole("list", {
    name: "Registros financieros seleccionados",
  })
  await expect(records.getByRole("listitem")).toHaveCount(4)
  await expect(records).toContainText("FAC-EVAL-3107")
  await expect(records).toContainText("USD")
  await expect(records).toContainText("Original: ARS")
  await records.getByRole("link", { name: "Abrir operación" }).first().click()
  await page.getByRole("link", { name: "Volver al análisis" }).click()
  await expect(page).toHaveURL(/serie=invoice.*grupo=2026-10/)
  await page.getByRole("link", { name: "Quitar selección del gráfico" }).click()
  await expect(page).toHaveURL(/desde=2026-10-01.*moneda=ARS/)
  await page
    .getByLabel("Filtrar moneda original", { exact: true })
    .selectOption("USD")
  await expect(page).toHaveURL(/moneda=USD/)
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true)
  }
})
test("@smoke finance shows registered expenses and reported balances, never treats missing as zero", async ({
  page,
}) => {
  await page.goto("/administracion/finanzas")
  await expect(
    page.getByRole("heading", { name: "Gastos por categoría" })
  ).toBeVisible()
  await expect(
    page.getByText(/saldos incompletos se omiten del gráfico/)
  ).toBeVisible()
  await page
    .getByRole("list", { name: /Registros de Gastos/ })
    .getByRole("link")
    .first()
    .click()
  await expect(
    page.getByRole("list", { name: "Registros financieros seleccionados" })
  ).toContainText("GAS-EVAL")
  await expect(
    page.getByRole("list", { name: "Registros financieros seleccionados" })
  ).not.toContainText("FAC-EVAL")
})
test("@smoke operational chart opens exactly its authorized situation", async ({
  page,
}) => {
  await page.goto("/acceso/escenarios")
  await page.getByRole("button", { name: /Operador de Importación/ }).click()
  await page
    .getByRole("list", { name: "Operaciones que explican el gráfico" })
    .getByRole("link")
    .first()
    .click()
  await expect(page).toHaveURL(/situacion=.*tipo=importacion/)
  await expect(page.getByLabel("Situación", { exact: true })).not.toHaveValue(
    ""
  )
  await expect(page.getByText("OP-DEM-3107", { exact: true })).toHaveCount(0)
})
