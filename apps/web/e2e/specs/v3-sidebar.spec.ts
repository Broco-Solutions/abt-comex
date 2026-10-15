import { expect, test } from "../fixtures"

test("@smoke sidebar reveals the active destination and scrolls without covering its footer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 480 })
  await page.goto("/gestion")
  const sidebar = page.locator('[data-slot="desktop-sidebar"]')
  const nav = sidebar.getByRole("navigation", {
    name: "Navegación principal",
    exact: true,
  })
  const selected = nav.getByRole("link", { name: "Dirección", exact: true })
  await expect(selected).toHaveAttribute("aria-current", "page")
  await expect(selected).toBeInViewport()
  expect(await nav.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  await nav.hover()
  await page.mouse.wheel(0, -800)
  await expect.poll(() => nav.evaluate((element) => element.scrollTop)).toBe(0)
  await selected.focus()
  await expect(selected).toBeFocused()
  await expect(selected).toBeInViewport()
  await expect(
    sidebar.getByRole("link", { name: "Configuración", exact: true })
  ).toBeInViewport()
  await expect(
    sidebar.getByRole("button", { name: "Menú de usuario", exact: true })
  ).toBeInViewport()
})

test("@smoke sidebar groups persist independently, keep parent routes and remove decorative arrows", async ({
  page,
}) => {
  await page.goto("/cotizaciones")
  const sidebar = page.locator('[data-slot="desktop-sidebar"]')
  for (const name of ["Operación diaria", "Registros", "Gestión"]) {
    await expect(
      sidebar.getByRole("region", { name, exact: true })
    ).toBeVisible()
  }
  await expect(
    sidebar.getByRole("link", { name: "Cotizaciones", exact: true })
  ).toHaveAttribute("aria-current", "page")
  await expect(
    sidebar
      .getByRole("link", { name: "Cotizaciones", exact: true })
      .locator(".lucide-chevron-right")
  ).toHaveCount(0)
  await sidebar
    .getByRole("button", { name: "Contraer Operaciones", exact: true })
    .click()
  await sidebar
    .getByRole("button", { name: "Contraer Clientes", exact: true })
    .click()
  await sidebar
    .getByRole("button", { name: "Expandir Clientes", exact: true })
    .click()
  await expect(
    sidebar.getByRole("button", { name: "Expandir Operaciones", exact: true })
  ).toHaveAttribute("aria-expanded", "false")
  await sidebar.getByRole("link", { name: "Clientes", exact: true }).click()
  await expect(page).toHaveURL(/\/clientes$/)
  await expect(
    sidebar.getByRole("button", { name: "Contraer Clientes", exact: true })
  ).toHaveAttribute("aria-expanded", "true")
  await page.reload()
  await expect(
    sidebar.getByRole("button", { name: "Expandir Operaciones", exact: true })
  ).toHaveAttribute("aria-expanded", "false")
  await sidebar
    .getByRole("button", { name: "Contraer navegación", exact: true })
    .click()
  await sidebar.getByRole("link", { name: "Operaciones", exact: true }).focus()
  await sidebar
    .getByRole("link", { name: "Importaciones", exact: true })
    .click()
  await expect(page).toHaveURL(/tipo=importacion$/)
  await sidebar
    .getByRole("button", { name: "Expandir navegación", exact: true })
    .click()
  await expect(
    sidebar.getByRole("button", { name: "Expandir Operaciones", exact: true })
  ).toBeVisible()
  await sidebar
    .getByRole("button", { name: "Expandir Operaciones", exact: true })
    .click()
  await expect(
    sidebar.getByRole("link", { name: "Importaciones", exact: true })
  ).toHaveAttribute("aria-current", "page")
})

test("@smoke pending badge reacts to shared work and bottom profile preserves context", async ({
  page,
}) => {
  await page.goto(
    "/operaciones/op-demo-2048/importacion?returnTo=%2Foperaciones"
  )
  const work = page.getByRole("link", { name: "Mi trabajo", exact: true })
  const badge = work.locator("[data-work-count]")
  await expect(badge).toBeVisible()
  const before = Number(await badge.getAttribute("data-work-count"))
  await page.getByLabel("Primera persona").selectOption("demo-person-01")
  await page.getByLabel("Segunda persona").selectOption("demo-person-02")
  await page
    .getByRole("button", { name: "Registrar control de demostración" })
    .click()
  await expect(badge).toHaveAttribute("data-work-count", String(before - 1))
  const currentUrl = page.url()
  await expect(
    page.locator("header").getByRole("button", { name: "Menú de usuario" })
  ).toHaveCount(0)
  const user = page.getByRole("button", { name: "Menú de usuario" })
  await user.click()
  await page.getByRole("button", { name: "Mi perfil", exact: true }).click()
  const profile = page.getByRole("dialog", { name: "Mi perfil", exact: true })
  await expect(profile).toContainText("no representa un inicio de sesión real")
  await expect(profile.getByRole("textbox")).toHaveCount(0)
  await profile.getByRole("button", { name: "Cerrar", exact: true }).click()
  await expect(user).toBeFocused()
  await expect(page).toHaveURL(currentUrl)
  await user.click()
  await page
    .getByRole("link", { name: "Cambiar escenario de evaluación", exact: true })
    .click()
  page.once("dialog", (dialog) => dialog.accept())
  await page.getByRole("button", { name: /Operador de Importación/ }).click()
  await expect(
    page.getByRole("link", { name: "Cotizaciones", exact: true })
  ).toHaveCount(0)
  await expect(
    page.getByRole("link", { name: "Administración y Finanzas", exact: true })
  ).toHaveCount(0)
})

test("@smoke drawer and short viewport keep settings, profile and navigation reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 568 })
  await page.goto("/clientes")
  await page.getByRole("button", { name: "Abrir navegación principal" }).click()
  const drawer = page.getByRole("dialog", {
    name: "Navegación principal",
    exact: true,
  })
  const navigation = drawer.getByRole("navigation", {
    name: "Navegación principal",
    exact: true,
  })
  const direction = navigation.getByRole("link", {
    name: "Dirección",
    exact: true,
  })
  await direction.scrollIntoViewIfNeeded()
  await expect(direction).toBeInViewport()
  await expect(
    drawer.getByRole("link", { name: "Configuración", exact: true })
  ).toBeInViewport()
  await drawer
    .getByRole("button", { name: "Menú de usuario", exact: true })
    .click()
  await expect(
    page.getByRole("link", { name: "Cambiar escenario de evaluación" })
  ).toBeInViewport()
  await page.keyboard.press("Escape")
  await page.keyboard.press("Escape")
  await expect(drawer).toBeHidden()
  await expect(
    page.getByRole("button", { name: "Abrir navegación principal" })
  ).toBeFocused()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})
