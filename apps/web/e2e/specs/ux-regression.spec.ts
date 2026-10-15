import { test, expect } from "../fixtures"

for (const width of [320, 430, 768, 1024, 1280, 1440]) {
  test(`@smoke V2 collections keep identity and opening actions in the usable ${width}px viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text())
    })
    for (const [path, name] of [
      ["/operaciones?tipo=importacion", "OP-DEM-2048"],
      ["/clientes", "Cliente Demo Norte"],
      ["/cotizaciones", "COT-DEM-001"],
      ["/administracion", "Abrir OP-DEM-3107"],
    ] as const) {
      await page.goto(path)
      const action = page
        .getByRole("main")
        .getByRole("link", { name, exact: true })
        .filter({ visible: true })
        .first()
      await expect(action).toBeVisible()
      const box = (await action.boundingBox())!
      expect(box.x, `${path}: left edge`).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width, `${path}: right edge`).toBeLessThanOrEqual(
        width
      )
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        ),
        path
      ).toBe(true)
      if (width < 768 && path.startsWith("/operaciones"))
        expect(
          box.y + box.height,
          "the first result follows the compact filters"
        ).toBeLessThanOrEqual(900)
      await expect(
        page
          .getByRole("banner")
          .getByRole("button", { name: "Ayuda", exact: true })
      ).toHaveCount(0)
    }
    expect(errors).toEqual([])
  })
}

test("@smoke invalid financial dates recover without charts, confirmed totals or lost currency", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/gestion?desde=2026-02-30&hasta=2026-10-14&moneda=USD")
  await expect(page.locator("#financial-period-error")).toContainText(
    "fecha inválida"
  )
  await expect(
    page.getByRole("heading", { name: "Facturación y cobranzas por mes" })
  ).toHaveCount(0)
  await expect(
    page.getByRole("navigation", { name: "Consultar registros financieros" })
  ).toHaveCount(0)
  await expect(page.getByLabel("Moneda", { exact: true })).toHaveValue("USD")
  await page.getByLabel("Desde · fecha del evento").fill("2026-10-01")
  await page.getByRole("button", { name: "Aplicar análisis" }).click()
  await expect(
    page.getByRole("heading", { name: "Facturación y cobranzas por mes" })
  ).toBeVisible()
  await expect(page.getByLabel("Moneda", { exact: true })).toHaveValue("USD")
  await page.goto("/gestion?desde=2026-10-14&hasta=2026-05-01&moneda=USD")
  await expect(page.locator("#financial-period-error")).toContainText(
    "anterior o igual"
  )
  await expect(
    page.getByRole("heading", { name: "Facturación y cobranzas por mes" })
  ).toHaveCount(0)
  expect(errors).toEqual([])
})

test("@smoke presentation preferences and secondary help work without replacing onboarding progress", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/configuracion")
  await page.getByRole("radio", { name: "Compacta", exact: true }).check()
  await expect(
    page.locator('[data-shell-navigation-mode="compact"]')
  ).toBeVisible()
  await page.getByRole("button", { name: "Restablecer navegación" }).click()
  await expect(
    page.locator('[data-shell-navigation-mode="expanded"]')
  ).toBeVisible()
  await page.getByRole("button", { name: "Menú de usuario" }).click()
  await page.getByRole("button", { name: "Abrir ayuda", exact: true }).click()
  await page
    .getByRole("dialog", { name: "Ayuda de ABT Comex" })
    .getByRole("link", { name: "Retomar orientación" })
    .click()
  await expect(
    page.getByRole("heading", { name: "Bienvenido a ABT Comex" })
  ).toBeVisible()
})
