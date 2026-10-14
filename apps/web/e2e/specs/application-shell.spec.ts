import { expect, test, type Page } from "@playwright/test"

function collectConsoleErrors(page: Page) {
  const errors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  page.on("pageerror", (error) => errors.push(error.message))
  return errors
}

test("@smoke redirects the root and navigates the complete application shell", async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)
  await page.goto("/")
  await expect(page).toHaveURL(/\/inicio$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Inicio" })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Inicio", exact: true })
  ).toHaveAttribute("aria-current", "page")
  await expect(page.getByLabel("Ruta de navegación")).toContainText("Inicio")

  const desktopNavigation = page.getByRole("navigation", {
    name: "Navegación principal",
  })
  await expect(desktopNavigation.getByRole("link").nth(0)).toHaveText("Inicio")
  await expect(desktopNavigation.getByRole("link").nth(1)).toHaveText(
    "Mi trabajo"
  )
  await expect(desktopNavigation.getByRole("link").nth(2)).toHaveText(
    "Operaciones"
  )
  await expect(desktopNavigation.getByRole("link").nth(3)).toHaveText(
    "Importaciones"
  )
  await expect(desktopNavigation.getByRole("link").nth(4)).toHaveText(
    "Exportaciones"
  )
  await expect(
    desktopNavigation.getByRole("link", { name: "Todas" })
  ).toHaveCount(0)
  await expect(
    desktopNavigation.getByRole("link", { name: "Mi trabajo" })
  ).toHaveAttribute("href", "/mi-trabajo")

  const destinations = [
    ["Mi trabajo", "/mi-trabajo"],
    ["Clientes", "/clientes"],
    ["Cotizaciones", "/cotizaciones"],
    ["Administración y Finanzas", "/administracion"],
    ["Gestión", "/gestion"],
    ["Configuración", "/configuracion"],
  ] as const

  for (const [label, path] of destinations) {
    await page.getByRole("link", { name: label, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    await expect(
      page.getByRole("heading", { level: 1, name: label })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: label, exact: true })
    ).toHaveAttribute("aria-current", "page")
  }
  expect(consoleErrors).toEqual([])
})

test("@smoke desktop navigation adapts, persists and keeps every destination operable", async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/inicio")

  const shell = page.locator("[data-shell-navigation-mode]")
  const sidebar = page.locator('[data-slot="desktop-sidebar"]')
  const navigation = page.getByRole("navigation", {
    name: "Navegación principal",
  })
  const expandedWidth = (await sidebar.boundingBox())?.width ?? 0

  await expect(shell).toHaveAttribute("data-shell-navigation-mode", "expanded")
  await expect(
    page.locator('[data-brand-variant="wordmark"]')
  ).toBeVisible()
  await expect(page.locator('[data-brand-variant="isotype"]')).toHaveCount(0)
  const fullAttribution = page.getByRole("link", {
    name: "Powered by Broco Solutions, enlace externo",
  })
  await expect(fullAttribution).toHaveText("Powered by")
  await expect(fullAttribution).not.toHaveText("Powered by Broco Solutions")
  await expect(
    fullAttribution.locator(
      'img[src="/brand/BROCO_SOLUTIONS_logo_gradient.svg"]'
    )
  ).toBeVisible()

  const collapseButton = page.getByRole("button", {
    name: "Contraer navegación",
  })
  await collapseButton.click()
  const expandButton = page.getByRole("button", {
    name: "Expandir navegación",
  })
  await expect(expandButton).toBeFocused()
  await expect(shell).toHaveAttribute("data-shell-navigation-mode", "compact")
  await expect(page.locator('[data-brand-variant="isotype"]')).toBeVisible()
  await expect(page.locator('[data-brand-variant="wordmark"]')).toHaveCount(0)
  const compactAttribution = page.getByRole("link", {
    name: "Powered by Broco Solutions",
  })
  await expect(
    compactAttribution.locator(
      'img[src="/brand/BROCO_SOLUTIONS_isotype_gradient.svg"]'
    )
  ).toBeVisible()
  await expect(
    compactAttribution.locator(
      'img[src="/brand/BROCO_SOLUTIONS_logo_gradient.svg"]'
    )
  ).toHaveCount(0)
  const compactWidth = (await sidebar.boundingBox())?.width ?? 0
  expect(expandedWidth - compactWidth).toBeGreaterThanOrEqual(180)

  const workLink = navigation.getByRole("link", { name: "Mi trabajo" })
  await workLink.hover()
  await expect(page.getByRole("tooltip", { name: "Mi trabajo" })).toBeVisible()
  await workLink.focus()
  await expect(page.getByRole("tooltip", { name: "Mi trabajo" })).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await workLink.click()
  await expect(page).toHaveURL(/\/mi-trabajo$/)

  await page
    .getByRole("link", { name: "ABT Comex — Ir a Inicio" })
    .click()
  await expect(page).toHaveURL(/\/inicio$/)

  const operationsLink = navigation.getByRole("link", { name: "Operaciones" })
  await operationsLink.click()
  await expect(page).toHaveURL(/\/operaciones$/)
  await expect(operationsLink).toHaveAttribute("aria-current", "page")
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1)

  await workLink.focus()
  await operationsLink.focus()
  await expect(operationsLink).toHaveAttribute("aria-expanded", "true")
  const importsLink = navigation.getByRole("link", { name: "Importaciones" })
  await page.keyboard.press("Tab")
  await expect(importsLink).toBeFocused()
  await importsLink.press("Enter")
  await expect(page).toHaveURL(/\/operaciones\?tipo=importacion$/)
  await workLink.focus()
  await operationsLink.focus()
  await expect(importsLink).toHaveAttribute("aria-current", "page")
  await expect(operationsLink).toHaveAttribute(
    "data-navigation-state",
    "section-active"
  )
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1)

  const exportsLink = navigation.getByRole("link", { name: "Exportaciones" })
  await exportsLink.click()
  await expect(page).toHaveURL(/\/operaciones\?tipo=exportacion$/)
  await workLink.focus()
  await operationsLink.focus()
  await expect(exportsLink).toHaveAttribute("aria-current", "page")

  await expect(operationsLink).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Escape")
  await expect(operationsLink).toBeFocused()
  await expect(operationsLink).toHaveAttribute("aria-expanded", "false")

  await page.reload()
  await expect(shell).toHaveAttribute("data-shell-navigation-mode", "compact")
  await page.setViewportSize({ width: 900, height: 800 })
  const mobileTrigger = page.getByRole("button", {
    name: "Abrir navegación principal",
  })
  await mobileTrigger.click()
  const drawer = page.getByRole("dialog", { name: "Navegación principal" })
  await expect(drawer.locator('[data-sidebar-mode="expanded"]')).toBeVisible()
  await expect(drawer.locator('[data-brand-variant="wordmark"]')).toBeVisible()
  await expect(drawer.locator('[data-brand-variant="isotype"]')).toHaveCount(0)
  await expect(
    drawer.locator('img[src="/brand/BROCO_SOLUTIONS_logo_gradient.svg"]')
  ).toBeVisible()
  await expect(
    drawer.locator('img[src="/brand/BROCO_SOLUTIONS_isotype_gradient.svg"]')
  ).toHaveCount(0)
  await page.keyboard.press("Escape")
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(shell).toHaveAttribute("data-shell-navigation-mode", "compact")
  await page.getByRole("button", { name: "Expandir navegación" }).click()
  await expect(shell).toHaveAttribute("data-shell-navigation-mode", "expanded")
  await page.reload()
  await expect(shell).toHaveAttribute("data-shell-navigation-mode", "expanded")
  expect(consoleErrors).toEqual([])
})

test("@smoke recognizes every Operaciones variant and its breadcrumbs", async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)
  await page.goto("/operaciones")
  const navigation = page.getByRole("navigation", {
    name: "Navegación principal",
  })
  const operationsLink = navigation.getByRole("link", {
    name: "Operaciones",
    exact: true,
  })
  await expect(operationsLink).toHaveAttribute("href", "/operaciones")
  await expect(operationsLink).toHaveAttribute("aria-current", "page")
  await expect(operationsLink).toHaveAttribute(
    "data-navigation-state",
    "selected"
  )
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1)
  await expect(navigation.getByRole("link", { name: "Todas" })).toHaveCount(0)
  await expect(page.getByLabel("Ruta de navegación")).toHaveText("Operaciones")

  const importsLink = navigation.getByRole("link", { name: "Importaciones" })
  await expect(importsLink).toHaveAttribute(
    "href",
    "/operaciones?tipo=importacion"
  )
  await importsLink.click()
  await expect(page).toHaveURL(/\/operaciones\?tipo=importacion$/)
  await expect(importsLink).toHaveAttribute("aria-current", "page")
  await expect(importsLink).toHaveAttribute("data-navigation-state", "selected")
  await expect(operationsLink).toHaveAttribute(
    "data-navigation-state",
    "section-active"
  )
  await expect(operationsLink).not.toHaveAttribute("aria-current")
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1)
  await expect(page.getByLabel("Ruta de navegación")).toContainText(
    "OperacionesImportaciones"
  )

  const exportsLink = navigation.getByRole("link", { name: "Exportaciones" })
  await expect(exportsLink).toHaveAttribute(
    "href",
    "/operaciones?tipo=exportacion"
  )
  await exportsLink.click()
  await expect(page).toHaveURL(/\/operaciones\?tipo=exportacion$/)
  await expect(exportsLink).toHaveAttribute("aria-current", "page")
  await expect(exportsLink).toHaveAttribute("data-navigation-state", "selected")
  await expect(operationsLink).toHaveAttribute(
    "data-navigation-state",
    "section-active"
  )
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1)
  expect(consoleErrors).toEqual([])
})

test("@smoke mobile drawer manages focus, Escape and route selection", async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/inicio")
  const trigger = page.getByRole("button", {
    name: "Abrir navegación principal",
  })

  await trigger.click()
  await expect(
    page.getByRole("dialog", { name: "Navegación principal" })
  ).toBeVisible()
  const firstDrawerLink = page.getByRole("link", {
    name: "Inicio",
    exact: true,
  })
  await expect(firstDrawerLink).toBeFocused()
  await page.keyboard.press("Tab")
  const workLink = page.getByRole("link", { name: "Mi trabajo" })
  await expect(workLink).toBeFocused()
  expect(
    await workLink.evaluate((element) => getComputedStyle(element).outlineStyle)
  ).not.toBe("none")
  const drawerNavigation = page
    .getByRole("dialog", { name: "Navegación principal" })
    .getByRole("navigation", { name: "Navegación principal" })
  await expect(drawerNavigation.getByRole("link").nth(0)).toHaveText("Inicio")
  await expect(drawerNavigation.getByRole("link").nth(1)).toHaveText(
    "Mi trabajo"
  )
  await expect(drawerNavigation.getByRole("link").nth(2)).toHaveText(
    "Operaciones"
  )
  await expect(drawerNavigation.getByRole("link").nth(3)).toHaveText(
    "Importaciones"
  )
  await expect(drawerNavigation.getByRole("link").nth(4)).toHaveText(
    "Exportaciones"
  )
  await expect(
    drawerNavigation.getByRole("link", { name: "Todas" })
  ).toHaveCount(0)
  await page.keyboard.press("Escape")
  await expect(
    page.getByRole("dialog", { name: "Navegación principal" })
  ).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.click()
  await page.getByRole("link", { name: "Clientes" }).click()
  await expect(page).toHaveURL(/\/clientes$/)
  await expect(
    page.getByRole("dialog", { name: "Navegación principal" })
  ).toBeHidden()
  expect(consoleErrors).toEqual([])
})

test("@smoke onboarding is contextual to Inicio and remains globally resumable", async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)
  await page.goto("/inicio")
  const onboardingSection = page.locator('[data-slot="onboarding-section"]')
  const welcome = page.getByRole("heading", { name: "Bienvenido a ABT Comex" })
  await expect(welcome).toBeVisible()
  await expect(onboardingSection).toHaveCount(1)

  await onboardingSection
    .getByText("Conocer la navegación principal", { exact: true })
    .click()
  await expect(onboardingSection.getByText("20%", { exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Configuración" }).click()
  await expect(page).toHaveURL(/\/configuracion$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Configuración" })
  ).toBeVisible()
  await expect(onboardingSection).toHaveCount(0)
  expect(
    await page
      .locator("main")
      .evaluate((element) => element.previousElementSibling?.tagName)
  ).toBe("HEADER")

  const helpTrigger = page.getByRole("button", { name: "Abrir ayuda" })
  await helpTrigger.click()
  const help = page.getByRole("dialog", { name: "Ayuda de ABT Comex" })
  await expect(help).toContainText("1 de 5 completados")
  await help.getByRole("link", { name: "Retomar orientación" }).click()
  await expect(page).toHaveURL(/\/inicio$/)
  await expect(welcome).toBeVisible()
  await expect(onboardingSection.getByText("20%", { exact: true })).toBeVisible()

  await page.getByRole("button", { name: "Omitir por ahora" }).click()
  await expect(welcome).toBeHidden()
  await expect(onboardingSection).toHaveCount(0)

  await page.getByRole("link", { name: "Configuración" }).click()
  await expect(onboardingSection).toHaveCount(0)
  await page.getByRole("link", { name: "Inicio", exact: true }).click()
  await expect(onboardingSection).toHaveCount(0)
  expect(
    await page
      .locator("main")
      .evaluate((element) => element.previousElementSibling?.tagName)
  ).toBe("HEADER")

  await page.getByRole("link", { name: "Configuración" }).click()
  await helpTrigger.click()
  await help.getByRole("button", { name: "Reiniciar progreso" }).click()
  await expect(help).toContainText("0 de 5 completados")
  await help.getByRole("link", { name: "Retomar orientación" }).click()
  await expect(page).toHaveURL(/\/inicio$/)
  await expect(welcome).toBeVisible()
  await expect(onboardingSection).toHaveCount(1)

  const checklist = onboardingSection.getByRole("group", {
    name: "Primeros pasos",
  })
  for (const item of await checklist.locator("label").all()) {
    await item.click()
  }
  await expect(onboardingSection).toHaveCount(0)
  expect(
    await page
      .locator("main")
      .evaluate((element) => element.previousElementSibling?.tagName)
  ).toBe("HEADER")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  expect(consoleErrors).toEqual([])
})

test("@smoke onboarding uses grouped columns on wide screens and stacks in reading order", async ({
  page,
}) => {
  const viewports = [
    { width: 1440, height: 900, columns: 2 },
    { width: 1280, height: 800, columns: 2 },
    { width: 1024, height: 768, columns: 1 },
    { width: 768, height: 1024, columns: 1 },
    { width: 390, height: 844, columns: 1 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto("/inicio")
    const grid = page.locator('[data-slot="onboarding-grid"]')
    await expect(grid).toBeVisible()
    await expect(grid.locator(":scope > *").nth(0)).toHaveAttribute(
      "data-slot",
      "onboarding-introduction"
    )
    await expect(grid.locator(":scope > *").nth(1)).toHaveAttribute(
      "data-slot",
      "onboarding-checklist"
    )
    expect(
      await grid.evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.split(" ").length
      )
    ).toBe(viewport.columns)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true)
  }
})

test("@smoke brand attribution opens the approved external destination", async ({
  context,
  page,
}) => {
  await context.route("https://brocosolutions.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "Broco",
    })
  })
  await page.goto("/inicio")
  const attribution = page.getByRole("link", {
    name: "Powered by Broco Solutions, enlace externo",
  })
  await expect(attribution).toHaveAttribute(
    "href",
    "https://brocosolutions.com"
  )
  await expect(attribution).toHaveAttribute("target", "_blank")
  await expect(attribution).toHaveAttribute("rel", "noopener noreferrer")
  const popupPromise = context.waitForEvent("page")
  await attribution.click()
  const popup = await popupPromise
  await expect(popup).toHaveURL("https://brocosolutions.com/")
})

test("@smoke design system remains outside the application shell", async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)
  const shellFrame = page.locator("[data-shell-navigation-mode]")
  await page.goto("/inicio")
  await expect(shellFrame).toBeVisible()

  await page.goto("/design-system")
  await expect(
    page.getByRole("heading", { level: 1, name: "Design System ABT" })
  ).toBeVisible()
  // Wait for the intentional sidebar examples, which share the shell's nav label.
  await expect(
    page
      .locator("#navegacion-shell")
      .getByRole("navigation", { name: "Navegación principal" })
  ).toHaveCount(2)
  await expect(shellFrame).toHaveCount(0)
  expect(consoleErrors).toEqual([])
})

test("@smoke shell uses the explicit navigation mode without horizontal overflow", async ({
  page,
}) => {
  const viewports = [
    { width: 1440, height: 900, desktop: true },
    { width: 1280, height: 800, desktop: true },
    { width: 1024, height: 768, desktop: true },
    { width: 960, height: 800, desktop: false },
    { width: 900, height: 800, desktop: false },
    { width: 820, height: 900, desktop: false },
    { width: 768, height: 1024, desktop: false },
    { width: 390, height: 844, desktop: false },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto("/inicio")
    const desktopNavigation = page.getByRole("navigation", {
      name: "Navegación principal",
    })
    const mobileTrigger = page.getByRole("button", {
      name: "Abrir navegación principal",
    })

    if (viewport.desktop) {
      await expect(desktopNavigation).toBeVisible()
      await expect(mobileTrigger).toBeHidden()
    } else {
      await expect(desktopNavigation).toBeHidden()
      await expect(mobileTrigger).toBeVisible()
    }

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true)
  }
})

test("@smoke an unknown internal route keeps the shell and offers recovery", async ({
  page,
}) => {
  await page.goto("/seccion-no-definida")
  await expect(
    page.getByRole("heading", { name: "No encontramos esta sección" })
  ).toBeVisible()
  await expect(
    page.getByRole("navigation", { name: "Navegación principal" })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Ir a Inicio", exact: true })
  ).toBeVisible()
})

test("@visual application shell desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/inicio")
  await expect(
    page.getByRole("heading", { level: 1, name: "Inicio" })
  ).toBeVisible()
  await expect(page).toHaveScreenshot("application-shell-desktop.png", {
    animations: "disabled",
    fullPage: true,
  })
})

test("@visual application shell desktop compact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/inicio")
  await page.getByRole("button", { name: "Contraer navegación" }).click()
  await expect(
    page.locator('[data-shell-navigation-mode="compact"]')
  ).toBeVisible()
  await expect(page).toHaveScreenshot("application-shell-desktop-compact.png", {
    animations: "disabled",
    fullPage: true,
  })
})

test("@visual application shell mobile drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "abt-comex:onboarding:v1",
      JSON.stringify({ completed: [], dismissed: true })
    )
  })
  await page.goto("/inicio")
  await page.getByRole("button", { name: "Abrir navegación principal" }).click()
  await expect(
    page.getByRole("dialog", { name: "Navegación principal" })
  ).toBeVisible()
  await expect(page).toHaveScreenshot("application-shell-mobile-drawer.png", {
    animations: "disabled",
  })
})
