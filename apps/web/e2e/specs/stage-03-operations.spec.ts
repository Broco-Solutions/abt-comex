import { expect, test } from "../fixtures"

test("@smoke operations list filters, preserves URL context, and stays usable on narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/operaciones")
  await expect(
    page.getByRole("heading", { level: 1, name: "Operaciones" })
  ).toBeVisible()
  await expect(page.getByText(/9 operaciones/)).toBeVisible()
  await expect(page.getByText(/honorarios|margen/i)).toHaveCount(0)

  await page.getByText("Más filtros", { exact: true }).click()
  await page
    .locator('select[name="tipo"]')
    .selectOption("exportacion", { force: true })
  await page
    .locator('select[name="situacion"]')
    .selectOption("Pendiente documental", { force: true })
  await expect(page).toHaveURL(/tipo=exportacion.*situacion=Pendiente/)
  await expect(
    page.getByRole("heading", { name: "Exportaciones" })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "OP-DEM-3120", exact: true }).first()
  ).toBeVisible()

  await page
    .getByRole("link", { name: "OP-DEM-3120", exact: true })
    .first()
    .click()
  await expect(page).toHaveURL(/operaciones\/op-demo-3120\?returnTo=/)
  await expect(page.getByRole("heading", { name: "OP-DEM-3120" })).toBeVisible()
  await page.getByRole("link", { name: "Volver a resultados" }).click()
  await expect(page).toHaveURL(/tipo=exportacion.*situacion=Pendiente/)
  await page
    .locator('select[name="agrupar"]')
    .selectOption("responsible", { force: true })
  await expect(page).toHaveURL(/agrupar=responsible/)
  await expect(
    page.getByRole("heading", { name: /Equipo Expo A/ })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "OP-DEM-3120", exact: true }).first()
  ).toBeVisible()
  await expect(page.getByLabel("Seleccionar OP-DEM-3120")).toHaveCount(0)

  for (const width of [1440, 1280, 1024, 960, 900, 820, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no horizontal page overflow at ${width}px`
    ).toBe(true)
  }
  await expect(
    page.getByRole("heading", { name: /Equipo Expo A/ })
  ).toBeVisible()
})

test("@smoke operations can be searched and recover from unavailable or restricted data", async ({
  page,
}) => {
  await page.goto("/operaciones?q=sur")
  await expect(
    page.getByRole("link", { name: "OP-DEM-2061", exact: true }).first()
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "OP-DEM-3133", exact: true }).first()
  ).toBeVisible()
  await page.goto("/operaciones?q=centro&error=lectura")
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Conservamos filtros y contexto" })
  ).toBeVisible()
  await page.getByRole("link", { name: "Reintentar" }).click()
  await expect(page).toHaveURL(/q=centro/)
  await expect(page.getByRole("link", { name: "OP-DEM-2054" })).toBeVisible()
  await page.goto("/operaciones?error=sin-permiso")
  await expect(
    page.getByRole("heading", { name: "Vista no disponible" })
  ).toBeVisible()
  await expect(page.getByText("OP-DEM-2048")).toHaveCount(0)
})
