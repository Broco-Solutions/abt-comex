import { expect, test } from "../fixtures"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("abt-comex:demo:scenario:v1", "client")
    sessionStorage.setItem("abt:test:scenario-initialized", "true")
  })
})

test("@smoke Portal uses a separate shell, a fictional identity and a restricted operation projection", async ({
  page,
}) => {
  await page.goto("/portal/acceso")
  await expect(
    page.getByRole("heading", { name: "Acceso al Portal" })
  ).toBeVisible()
  await expect(page.getByLabel(/contraseña/i)).toHaveCount(0)
  await page.getByRole("button", { name: "Entrar al Portal" }).click()
  await expect(page).toHaveURL(/\/portal\?cliente=client-demo-centro/)

  await expect(
    page.getByRole("heading", { name: "Hola, Cliente Demo Centro" })
  ).toBeVisible()
  await expect(page.getByText("OP-DEM-2054").first()).toBeVisible()
  await expect(page.getByText("OP-DEM-3112")).toBeVisible()
  await expect(page.getByText("OP-DEM-2048")).toHaveCount(0)
  await expect(page.getByText("Equipo Impo B")).toHaveCount(0)
  await expect(page.getByText("Revisar documentación pendiente")).toHaveCount(0)
  await expect(page.getByRole("button", { name: /Enviar/i })).toHaveCount(0)
  await expect(
    page.getByRole("navigation", { name: "Navegación principal" })
  ).toHaveCount(0)

  await page.getByRole("link", { name: "Ver estado" }).first().click()
  await expect(page).toHaveURL(
    /\/portal\/operaciones\/op-demo-2054\?cliente=client-demo-centro/
  )
  await expect(
    page.getByText("Pendiente documental", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Documentos y pendientes" })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: /Ver referencia/ })
  ).toBeVisible()
  await expect(page.getByText(/Sin hitos informados/)).toBeVisible()
})

test("@smoke Portal denies another client's operation without disclosing its identity", async ({
  page,
}) => {
  await page.goto("/portal/operaciones/op-demo-3133?cliente=client-demo-centro")
  await expect(
    page.getByRole("heading", { name: "Contexto no disponible" })
  ).toBeVisible()
  await expect(page.getByText("OP-DEM-3133")).toHaveCount(0)
  await expect(page.getByText("Cliente Demo Sur")).toHaveCount(0)
  await expect(page.getByText("Equipo Expo B")).toHaveCount(0)
})

test("@smoke Portal navigation remains separate and responsive", async ({
  page,
}) => {
  await page.goto("/portal?cliente=client-demo-centro")
  await expect(
    page.getByRole("heading", {
      name: "Hola, Cliente Demo Centro",
      exact: true,
    })
  ).toBeVisible()
  for (const width of [1440, 1280, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 844 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `no page overflow at ${width}px`
    ).toBe(true)
  }
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("link", { name: "Saltar al contenido principal" })
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#portal-main")).toBeFocused()
  await page.getByRole("link", { name: "Cambiar escenario" }).focus()
  await expect(
    page.getByRole("link", { name: "Cambiar escenario" })
  ).toBeFocused()
  await page.getByRole("link", { name: "Cambiar escenario" }).click()
  await expect(page).toHaveURL(/\/acceso$/)
})
