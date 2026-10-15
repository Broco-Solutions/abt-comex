import { expect, test } from "../fixtures"

test("@smoke global search groups records and pages, navigates by keyboard and preserves its origin", async ({
  page,
}) => {
  await page.goto("/clientes?q=Norte")
  const origin = page.url()
  await page
    .getByRole("button", { name: "Buscar o ir a…", exact: true })
    .click()
  const input = page.getByRole("combobox", { name: "Buscar en ABT Comex" })
  await expect(input).toBeFocused()
  await expect(
    page.getByText("Accesos directos", { exact: true })
  ).toBeVisible()
  let documents = 0
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await input.fill("Norte")
  for (const name of ["Operaciones", "Cotizaciones", "Clientes"])
    await expect(page.getByRole("group", { name, exact: true })).toBeVisible()
  const before = await input.getAttribute("aria-activedescendant")
  await input.press("ArrowDown")
  expect(await input.getAttribute("aria-activedescendant")).not.toBe(before)
  await input.press("ArrowUp")
  await expect(input).toHaveAttribute("aria-activedescendant", before!)
  await input.fill("sin-coincidencias-zzz")
  await expect(page.getByRole("option")).toHaveCount(0)
  await input.press("Enter")
  await expect(page).toHaveURL(origin)
  expect(documents).toBe(0)
  await input.fill("2048")
  await input.press("Enter")
  await expect(
    page.getByRole("heading", { name: "OP-DEM-2048", exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("dialog", { name: "Buscar o ir a…", exact: true })
  ).toHaveCount(0)
  await page
    .getByRole("link", { name: "Volver a Clientes", exact: true })
    .click()
  await expect(page).toHaveURL(origin)
  await page.keyboard.press("Control+k")
  await input.fill("COT-DEM-001")
  await input.press("Enter")
  await expect(
    page.getByRole("heading", { name: "COT-DEM-001", exact: true })
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Volver a Clientes", exact: true })
    .click()
  await expect(page).toHaveURL(origin)
  await page.keyboard.press("Control+k")
  await input.fill("Cliente Demo Sur")
  await page
    .getByRole("group", { name: "Clientes", exact: true })
    .getByRole("option", { name: /^Cliente Demo Sur/ })
    .click()
  await expect(
    page.getByRole("heading", { name: "Cliente Demo Sur", exact: true })
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Volver a Clientes", exact: true })
    .click()
  await expect(page).toHaveURL(origin)
  await page.keyboard.press("Control+k")
  await input.fill("cuentas cobrar")
  await expect(
    page.getByRole("group", { name: "Pantallas", exact: true })
  ).toBeVisible()
  await input.press("Enter")
  await expect(page).toHaveURL(/administracion\/carteras\?cartera=cobrar$/)
})

test("@smoke global shortcuts preserve form focus and dismiss by Escape, Tab or outside interaction", async ({
  page,
}) => {
  await page.goto("/clientes?q=Norte")
  const local = page.getByLabel("Buscar cliente o referencia de operación")
  await local.focus()
  await page.keyboard.press("Control+k")
  const input = page.getByRole("combobox", { name: "Buscar en ABT Comex" })
  await expect(input).toBeFocused()
  await input.fill("2048")
  await page.keyboard.press("Meta+k")
  await page.keyboard.press("Escape")
  await expect(local).toBeFocused()
  await expect(local).toHaveValue("Norte")
  await page.keyboard.press("Meta+k")
  await expect(input).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("button", { name: "Cerrar buscador", exact: true })
  ).toBeFocused()
  await page.keyboard.press("Shift+Tab")
  await expect(input).toBeFocused()
  await page.keyboard.press("Escape")
  const trigger = page.getByRole("button", {
    name: "Buscar o ir a…",
    exact: true,
  })
  await trigger.click()
  await expect(input).toHaveValue("")
  await page.mouse.click(1, 1)
  await expect(
    page.getByRole("dialog", { name: "Buscar o ir a…", exact: true })
  ).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test("@smoke search excludes restricted families and resets when the evaluation scenario changes", async ({
  page,
}) => {
  await page.goto("/acceso/escenarios")
  await page.getByRole("button", { name: /Operador de Importación/ }).click()
  await expect(page).toHaveURL(/\/inicio$/)
  await expect(
    page.getByRole("button", { name: "Buscar o ir a…", exact: true })
  ).toBeVisible()
  await page.keyboard.press("Control+k")
  const input = page.getByRole("combobox", { name: "Buscar en ABT Comex" })
  for (const query of [
    "3107",
    "cotizaciones",
    "finanzas",
    "costos",
    "cuentas pagar",
    "personas",
  ]) {
    await input.fill(query)
    await expect(page.getByRole("option")).toHaveCount(0)
    await expect(
      page.getByText("0 resultados disponibles", { exact: true })
    ).toBeAttached()
  }
  await input.fill("Norte")
  await expect(
    page
      .getByRole("group", { name: "Operaciones", exact: true })
      .getByRole("option")
  ).toHaveCount(1)
  await expect(
    page.getByRole("group", { name: "Cotizaciones", exact: true })
  ).toHaveCount(0)
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Menú de usuario" }).click()
  await page
    .getByRole("link", { name: "Cambiar escenario de evaluación" })
    .click()
  await page.getByRole("button", { name: /Dirección/ }).click()
  await expect(page).toHaveURL(/\/inicio$/)
  await page.keyboard.press("Control+k")
  await expect(input).toHaveValue("")
  await input.fill("COT-DEM-001")
  await expect(page.getByRole("option")).toHaveCount(1)
  await page.keyboard.press("Escape")
  await page.goto("/acceso/escenarios")
  await page.getByRole("button", { name: /Cliente externo/ }).click()
  await expect(page).toHaveURL(/\/portal(?:\?|$)/)
  await expect(
    page.getByRole("button", { name: "Buscar o ir a…", exact: true })
  ).toHaveCount(0)
  await page.keyboard.press("Control+k")
  await expect(
    page.getByRole("combobox", { name: "Buscar en ABT Comex" })
  ).toHaveCount(0)
})

test("@smoke search discovers a customer, quote and operation created through the shared demo", async ({
  page,
}) => {
  await page.goto("/cotizaciones/nueva")
  await page
    .getByLabel("Servicio", { exact: true })
    .fill("Servicio Buscador V3")
  await page.getByRole("button", { name: "Nuevo cliente", exact: true }).click()
  const editor = page.getByRole("dialog", {
    name: "Crear organización",
    exact: true,
  })
  await editor
    .getByLabel("Nombre o razón social")
    .fill("Cliente de búsqueda V3")
  await editor.getByRole("button", { name: "Guardar localmente" }).click()
  await page
    .getByLabel("Descripción de línea 1", { exact: true })
    .fill("Servicio sintético")
  await page.getByLabel("Precio unitario (ARS)", { exact: true }).fill("120")
  await page.getByRole("button", { name: "Guardar borrador local" }).click()
  await expect(page.getByRole("heading", { name: /COT-DEM-/ })).toBeVisible()
  await page.keyboard.press("Control+k")
  const input = page.getByRole("combobox", { name: "Buscar en ABT Comex" })
  await input.fill("búsqueda V3")
  await expect(
    page
      .getByRole("group", { name: "Clientes", exact: true })
      .getByRole("option")
  ).toHaveCount(1)
  await expect(
    page
      .getByRole("group", { name: "Cotizaciones", exact: true })
      .getByRole("option")
  ).toHaveCount(1)
  await page.keyboard.press("Escape")
  await page.goto("/operaciones/nueva")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page
    .getByRole("combobox", { name: "Cliente", exact: true })
    .fill("búsqueda V3")
  await page
    .getByRole("option", { name: "Cliente de búsqueda V3", exact: true })
    .click()
  await page.getByLabel("Importación", { exact: true }).check()
  await page.getByLabel("Modalidad de referencia").selectOption("Marítima")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page
    .getByLabel("Equipo responsable de referencia")
    .selectOption("Equipo Impo A")
  await page.getByRole("button", { name: /Continuar/ }).click()
  await page.getByRole("button", { name: "Crear operación local" }).click()
  await expect(
    page.getByRole("heading", { name: "OP-DEM-3142", exact: true })
  ).toBeVisible()
  await page.keyboard.press("Control+k")
  await input.fill("búsqueda V3")
  for (const name of ["Operaciones", "Cotizaciones", "Clientes"])
    await expect(
      page.getByRole("group", { name, exact: true }).getByRole("option")
    ).toHaveCount(1)
  await expect(page.getByRole("option", { name: /^OP-DEM-3142/ })).toBeVisible()
})

test("@smoke global search fits phone, tablet and desktop without header collisions", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 768 })
    await page.goto("/clientes")
    const trigger = page.getByRole("button", {
      name: "Buscar o ir a…",
      exact: true,
    })
    await expect(trigger).toBeInViewport()
    const breadcrumbBox = await page
      .getByLabel("Ruta de navegación")
      .boundingBox()
    const triggerBox = await trigger.boundingBox()
    expect(breadcrumbBox!.x + breadcrumbBox!.width).toBeLessThanOrEqual(
      triggerBox!.x
    )
    await page.evaluate(() => window.scrollTo(0, 160))
    const scrollBefore = await page.evaluate(() => window.scrollY)
    await trigger.click()
    const dialog = page.getByRole("dialog", {
      name: "Buscar o ir a…",
      exact: true,
    })
    await expect(dialog).toBeInViewport()
    const input = page.getByRole("combobox", { name: "Buscar en ABT Comex" })
    await input.fill("2048")
    await expect(
      page.getByRole("option", { name: /^OP-DEM-2048/ })
    ).toBeInViewport()
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true)
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  }
})
