import { expect, test } from "@playwright/test"

test("@smoke clients relate to operations and preserve the way back", async ({
  page,
}) => {
  await page.goto("/clientes")
  await expect(page.getByRole("heading", { name: "Clientes" })).toBeVisible()
  await expect(
    page.getByText(/4 de 4 clientes sintéticos visibles/)
  ).toBeVisible()
  await page
    .getByRole("link", { name: /Abrir ficha/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/clientes\/client-demo-norte\?returnTo=/)
  await expect(
    page.getByRole("heading", { name: "Cliente Demo Norte" })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Operaciones relacionadas" })
  ).toBeVisible()
  await page
    .getByRole("link", { name: /Abrir operación/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/operaciones\/op-demo-2048\?returnTo=/)
  await expect(
    page.getByRole("link", { name: "Cliente Demo Norte" })
  ).toHaveAttribute("href", /\/clientes\/client-demo-norte\?returnTo=/)
  await page.getByRole("link", { name: "Cliente Demo Norte" }).click()
  await expect(
    page.getByRole("link", { name: "Volver al contexto anterior" })
  ).toHaveAttribute("href", /\/operaciones\/op-demo-2048\?returnTo=/)
})

test("@smoke client search works on mobile without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/clientes?q=op-dem-3120")
  await expect(
    page.getByRole("heading", { name: "Cliente Demo Este" })
  ).toBeVisible()
  await expect(page.getByRole("list", { name: "Clientes del escenario" }).getByRole("listitem")).toHaveCount(1)
  const dimensions = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }))
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
})
