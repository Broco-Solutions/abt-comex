import { expect, test } from "../fixtures"

test("@smoke V3 filters update in place and browser history restores the view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto("/operaciones?tipo=importacion&orden=reference&direccion=asc")
  const first = page
    .getByRole("link", { name: "OP-DEM-2048", exact: true })
    .first()
  await expect(first).toBeVisible()
  expect((await first.boundingBox())!.y).toBeLessThan(768)
  let documents = 0
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await page.locator('select[name="agrupar"]').focus()
  await page.locator('select[name="agrupar"]').selectOption("responsible")
  await expect(page).toHaveURL(/agrupar=responsible/)
  await expect(page).toHaveURL(/orden=reference&direccion=asc/)
  await expect(page.locator('select[name="agrupar"]')).toBeFocused()
  expect(documents).toBe(0)
  await page.goBack()
  await expect(page.locator('select[name="agrupar"]')).toHaveValue("")
  await page.goForward()
  await expect(page.locator('select[name="agrupar"]')).toHaveValue(
    "responsible"
  )
  await first.scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => window.scrollY)
  await first.click()
  await page.getByRole("link", { name: "Volver a resultados" }).click()
  await expect(first).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(before)
})

test("@smoke V3 Portal summary and detail share documentary availability", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("abt-comex:demo:scenario:v1", "client")
  )
  await page.goto("/portal?cliente=client-demo-centro")
  await page
    .getByRole("link", { name: "Factura comercial · OP-DEM-2054" })
    .click()
  await expect(page).toHaveURL(/portal\/operaciones\/op-demo-2054/)
  await expect(
    page.getByRole("heading", { name: "OP-DEM-2054", exact: true })
  ).toBeVisible()
  await expect(
    page.getByText("Copia disponible", { exact: false })
  ).toBeVisible()
  await expect(page.getByText("PE-DEM-1401")).toHaveCount(0)
})
