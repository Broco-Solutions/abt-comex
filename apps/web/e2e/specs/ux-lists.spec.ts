import { expect, test } from "@playwright/test"

test("@smoke primary records and actions fit the usable mobile area", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/operaciones?tipo=importacion")
  const operation = page
    .getByRole("link", { name: "OP-DEM-2048", exact: true })
    .last()
  await expect(operation).toBeVisible()
  expect((await operation.boundingBox())!.y).toBeLessThan(844)
  await page.goto("/administracion")
  const action = page
    .getByRole("link", { name: "Abrir OP-DEM-3107", exact: true })
    .first()
  await expect(action).toBeVisible()
  const box = (await action.boundingBox())!
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(390)
})

test("@smoke identity survives column preferences and desktop widths reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/operaciones?tipo=importacion")
  await page.getByText("Columnas visibles", { exact: true }).click()
  await expect(
    page.getByRole("checkbox", { name: "Referencia", exact: true })
  ).toHaveCount(0)
  await page
    .getByRole("checkbox", { name: "Responsable", exact: true })
    .uncheck()
  await expect(
    page.getByRole("link", { name: "OP-DEM-2048", exact: true }).first()
  ).toBeVisible()
  await page.getByRole("button", { name: "Restablecer vista" }).click()
  const handle = page.getByRole("separator", {
    name: "Modificar ancho de columna Referencia",
    exact: true,
  })
  await handle.focus()
  await handle.press("ArrowRight")
  await expect(handle).toHaveAttribute("aria-valuenow", "136")
  await page.getByRole("button", { name: "Restablecer vista" }).click()
  await expect(handle).toHaveAttribute("aria-valuenow", "120")
  await page.setViewportSize({ width: 1024, height: 768 })
  await expect(
    page.getByRole("columnheader", { name: /Responsable/ })
  ).toBeVisible()
})
