import { expect, test } from "../fixtures"

test("@smoke changing a modified scenario can be cancelled and resets only temporary data", async ({
  page,
}) => {
  await page.goto("/operaciones/op-demo-2048/importacion")
  await page.getByLabel("Primera persona").selectOption("demo-person-01")
  await page.getByLabel("Segunda persona").selectOption("demo-person-02")
  await page
    .getByRole("button", { name: "Registrar control de demostración" })
    .click()
  await page.goto("/acceso")
  page.once("dialog", (dialog) => dialog.dismiss())
  await page.getByRole("button", { name: /Operador de Importación/ }).click()
  await expect(page).toHaveURL(/acceso$/)
  page.once("dialog", (dialog) => dialog.accept())
  await page.getByRole("button", { name: /Operador de Importación/ }).click()
  await expect(page).toHaveURL(/inicio$/)
  await page.goto("/mi-trabajo?vista=controls")
  await expect(
    page.getByRole("heading", {
      name: "Segundo control previo a oficialización",
    })
  ).toBeVisible()
})

test("@smoke without a selected perspective internal data is not presented", async ({
  page,
}) => {
  await page.goto("/acceso")
  await page.evaluate(() =>
    sessionStorage.removeItem("abt-comex:demo:scenario:v1")
  )
  await page.goto("/inicio")
  await expect(
    page.getByRole("heading", { name: "Elegí una perspectiva" })
  ).toBeVisible()
  await expect(
    page.getByRole("navigation", { name: "Navegación principal", exact: true })
  ).toHaveCount(0)
  await expect(page.getByText("OP-DEM-2048")).toHaveCount(0)
})

test("@smoke perspective changes preserve onboarding progress and recover its tour", async ({
  page,
}) => {
  await page.goto("/inicio")
  await page
    .locator("label")
    .filter({ hasText: "Conocer la navegación principal" })
    .click()
  await expect(page.getByText("20%", { exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Omitir por ahora" }).click()
  await page.goto("/acceso")
  await page.getByRole("button", { name: /Operador de Exportación/ }).click()
  await page.getByRole("button", { name: "Menú de usuario" }).click()
  await page
    .getByRole("link", { name: "Retomar inducción", exact: true })
    .click()
  await expect(page.getByText("20%", { exact: true })).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Bienvenido a ABT Comex" })
  ).toBeVisible()
})

test("@smoke operational scenario hides commercial content and filters shared objects", async ({
  page,
}) => {
  await page.goto("/acceso")
  await page.getByRole("button", { name: /Operador de Importación/ }).click()
  await expect(page).toHaveURL(/inicio$/)
  const nav = page.getByRole("navigation", {
    name: "Navegación principal",
    exact: true,
  })
  await expect(
    nav.getByRole("link", { name: "Cotizaciones", exact: true })
  ).toHaveCount(0)
  await expect(
    nav.getByRole("link", { name: "Administración y Finanzas", exact: true })
  ).toHaveCount(0)
  await page.goto("/operaciones")
  await expect(
    page.getByRole("link", { name: "OP-DEM-3107", exact: true })
  ).toHaveCount(0)
  await page.goto("/operaciones?tipo=exportacion")
  await expect(
    page.getByRole("heading", { name: "Vista no disponible" })
  ).toBeVisible()
  await expect(page.getByText(/0 operaciones|OP-DEM-3107/)).toHaveCount(0)
  await page.goto("/cotizaciones/quote-demo-001")
  await expect(
    page.getByRole("heading", { name: "Vista no disponible" })
  ).toBeVisible()
  await expect(page.getByText(/24\.000|ARS|USD/)).toHaveCount(0)
  await page.goto("/inicio")
  await page.getByRole("button", { name: "Menú de usuario" }).click()
  await page.getByRole("button", { name: "Salir", exact: true }).click()
  await expect(page).toHaveURL(/acceso$/)
})

test("@smoke external scenario opens its own shell and authorized records", async ({
  page,
}) => {
  await page.goto("/acceso")
  await page.getByRole("button", { name: /Cliente externo/ }).click()
  await expect(page.getByText("OP-DEM-2054", { exact: true }).first()).toBeVisible()
  await expect(page.getByText("OP-DEM-3112", { exact: true })).toBeVisible()
  await expect(page.getByText("OP-DEM-2048", { exact: true })).toHaveCount(0)
  await expect(page).toHaveURL(/portal\?cliente=client-demo-centro$/)
  await expect(
    page.getByRole("navigation", { name: "Navegación del Portal" })
  ).toBeVisible()
  await expect(
    page.getByRole("navigation", { name: "Navegación principal", exact: true })
  ).toHaveCount(0)
  await expect(page.getByText(/honorarios|márgenes|24\.000/)).toHaveCount(0)
})
