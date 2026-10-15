import { expect, test } from "../fixtures"
test("@smoke ABT roster excludes shared mailboxes, inferred access and fictional memberships", async ({ page }) => {
  await page.goto("/configuracion/personas")
  const roster = page.getByRole("list", { name: "Integrantes", exact: true })
  await expect(roster.getByRole("listitem")).toHaveCount(16)
  await expect(roster).toContainText("Ramiro Garcia")
  await expect(roster).toContainText("Sergio Mentini")
  await expect(roster).not.toContainText("@example.invalid")
  await expect(roster).not.toContainText("administracion@")
  await expect(roster.getByText("No relevado", { exact: true })).toHaveCount(16)
  await page.getByRole("link", { name: "Magali", exact: true }).click()
  await expect(page.getByRole("region", { name: "Datos del integrante" })).toContainText("Sin correo de acceso")
  await expect(page.getByText("Sin capacidades asignadas.")).toBeVisible()
  await page.goto("/mi-trabajo")
  await expect(page.getByRole("main")).not.toContainText("Lucía Benítez")
  await expect(page.getByRole("main")).not.toContainText("Ramiro Garcia")
})
test("@smoke people filters are local and the explicit return restores query and focus", async ({
  page,
}) => {
  await page.goto("/configuracion/personas")
  let documents = 0
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await page.getByLabel("Buscar integrante").fill("Importación")
  await expect(page).toHaveURL(/q=Import/)
  expect(documents).toBe(0)
  await page.getByRole("link", { name: "Sergio Mentini", exact: true }).click()
  await page
    .getByRole("link", { name: "Volver a Personas", exact: true })
    .click()
  await expect(page.getByLabel("Buscar integrante")).toHaveValue("Importación")
  await expect(
    page.getByRole("link", {
      name: "Sergio Mentini",
      exact: true,
    })
  ).toBeFocused()
  await page.goBack()
  await expect(
    page.getByRole("heading", {
      name: "Sergio Mentini",
      exact: true,
    })
  ).toBeVisible()
})
test("@smoke conventional access keeps scenarios secondary and never stores a password", async ({
  page,
}) => {
  await page.goto("/acceso")
  await expect(
    page.getByRole("button", { name: "Dirección", exact: true })
  ).toHaveCount(0)
  await page.getByLabel("Contraseña", { exact: true }).fill("prueba-no-real")
  await page
    .getByRole("button", { name: "Mostrar contraseña", exact: true })
    .click()
  await expect(page.getByLabel("Contraseña", { exact: true })).toHaveAttribute(
    "type",
    "text"
  )
  await page
    .getByRole("button", { name: "Ocultar contraseña", exact: true })
    .click()
  await page.getByRole("button", { name: "Ingresar", exact: true }).click()
  await expect(page).toHaveURL(/inicio$/)
  const stored = await page.evaluate(() =>
    JSON.stringify({ ...localStorage, ...sessionStorage })
  )
  expect(stored).not.toContain("prueba-no-real")
})
test("@smoke recovery shows confirmation, mismatched fields, expiration and a safe return", async ({
  page,
}) => {
  await page.goto("/acceso")
  await page.getByRole("link", { name: "Olvidé mi contraseña" }).click()
  await expect(
    page.getByRole("heading", { name: "Recuperar acceso", exact: true })
  ).toBeVisible()
  await page
    .getByLabel("Correo laboral", { exact: true })
    .fill("persona@example.invalid")
  await page.getByRole("button", { name: "Preparar recuperación" }).click()
  await expect(page.getByRole("status")).toContainText(
    "No se envió ningún correo"
  )
  await page
    .getByRole("link", { name: "Continuar con enlace de prueba" })
    .click()
  await page.getByLabel("Nueva contraseña", { exact: true }).fill("uno")
  await page.getByLabel("Repetir contraseña", { exact: true }).fill("dos")
  await page.getByRole("button", { name: "Confirmar prueba" }).click()
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "no coinciden"
  )
  await page.getByLabel("Repetir contraseña", { exact: true }).fill("uno")
  await page.getByRole("button", { name: "Confirmar prueba" }).click()
  await expect(page.getByRole("status")).toContainText(
    "No se modificó ninguna contraseña"
  )
  await page.goto("/acceso/restablecer")
  await page
    .getByRole("button", { name: "Ver estado de enlace vencido" })
    .click()
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "venció"
  )
  await page
    .getByRole("link", { name: "Volver al acceso", exact: true })
    .click()
  await expect(page).toHaveURL(/acceso$/)
})
test("@smoke membership edits persist, capabilities are independent of area and suspension reassigns work", async ({
  page,
}) => {
  await page.goto("/configuracion/personas/person-abt-002")
  await page.getByRole("button", { name: "Editar integrante" }).click()
  const dialog = page.getByRole("dialog")
  await dialog.getByLabel("Área", { exact: true }).fill("Dirección")
  await expect(
    dialog.getByLabel("Fecha de ingreso", { exact: true })
  ).toHaveValue("")
  await expect(
    dialog.getByLabel("Consultar condiciones", { exact: false })
  ).toHaveCount(0)
  await expect(
    dialog.getByLabel("Consultar cotizaciones y condiciones comerciales")
  ).not.toBeChecked()
  await expect(
    dialog.getByLabel("Consultar comprobantes y facturación")
  ).not.toBeChecked()
  await dialog
    .getByLabel("Fecha de ingreso", { exact: true })
    .fill("2026-01-12")
  await dialog.getByLabel("Acceso", { exact: true }).selectOption("Activo")
  await dialog.getByRole("button", { name: "Guardar integrante" }).click()
  await expect(
    page.getByRole("region", { name: "Datos del integrante" })
  ).toContainText("12/01/2026")
  await page.getByRole("button", { name: "Revisar suspensión o baja" }).click()
  await page
    .getByRole("combobox", { name: "Transferir pendientes a" })
    .fill("Maria Nasuti")
  await expect(page.getByRole("option", { name: /Maria Nasuti/ })).toHaveCount(
    0
  )
  await page
    .getByRole("combobox", { name: "Transferir pendientes a" })
    .fill("Bandeja del equipo")
  await page.getByRole("option", { name: /Bandeja del equipo/ }).click()
  await page.getByRole("button", { name: "Confirmar transición" }).click()
  await expect(page.getByRole("status")).toContainText("reasignados")
  await page.goto("/acceso")
  await page
    .getByLabel("Correo laboral", { exact: true })
    .fill("sergio@abtsisa.com.ar")
  await page.getByLabel("Contraseña", { exact: true }).fill("prueba")
  await page.getByRole("button", { name: "Ingresar", exact: true }).click()
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "acceso activo"
  )
  await page.goto("/mi-trabajo?q=Segundo")
  await expect(page.getByText("Sergio Mentini", { exact: true })).toHaveCount(0)
})
test("@smoke new member and team are usable, and partial financial capabilities do not reveal other records", async ({
  page,
}) => {
  await page.goto("/configuracion/personas")
  await page.getByRole("button", { name: "Nuevo integrante" }).click()
  const dialog = page.getByRole("dialog")
  await dialog
    .getByLabel("Nombre", { exact: true })
    .fill("Consulta limitada de prueba")
  await dialog
    .getByLabel("Correo laboral", { exact: true })
    .fill("limitada@example.invalid")
  await dialog.getByLabel("Acceso", { exact: true }).selectOption("Activo")
  await dialog
    .getByLabel("Contexto de evaluación")
    .selectOption("administration")
  await dialog.getByLabel("Consultar comprobantes y facturación").check()
  await dialog.getByRole("button", { name: "Guardar integrante" }).click()
  await expect(page.getByRole("status")).toContainText("guardado")
  await page.goto("/configuracion/equipos")
  await page.getByRole("button", { name: "Nuevo equipo" }).click()
  await page.getByLabel("Nombre del equipo").fill("Equipo de prueba V3")
  await page.getByRole("button", { name: "Guardar equipo" }).click()
  await expect(
    page.getByRole("heading", { name: "Equipo de prueba V3" })
  ).toBeVisible()
  await page.goto("/acceso")
  await page
    .getByLabel("Correo laboral", { exact: true })
    .fill("limitada@example.invalid")
  await page.getByLabel("Contraseña", { exact: true }).fill("prueba")
  page.once("dialog", (dialog) => dialog.accept())
  await page.getByRole("button", { name: "Ingresar", exact: true }).click()
  await page.goto("/administracion/finanzas?serie=receipt&dimension=all")
  await expect(
    page.getByText("Esta selección no está disponible para tus capacidades.")
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Ver cobros", exact: true })
  ).toHaveCount(0)
  await expect(
    page.getByRole("link", { name: "Ver gastos", exact: true })
  ).toHaveCount(0)
  await page.goto("/configuracion/personas")
  await expect(
    page.getByRole("heading", { name: "Vista no disponible" })
  ).toBeVisible()
})
