import { expect, test } from "../fixtures"

test("@smoke V3 creates a client inside a quote and keeps the draft and reusable identity", async ({
  page,
}) => {
  await page.goto("/cotizaciones/nueva")
  await page
    .getByLabel("Servicio", { exact: true })
    .fill("Preparación de prueba")
  await page.getByRole("button", { name: "Nuevo cliente", exact: true }).click()
  const dialog = page.getByRole("dialog")
  await dialog
    .getByLabel("Nombre o razón social")
    .fill("Organización Sintética del Recorrido")
  await dialog.getByRole("button", { name: "Agregar contacto" }).click()
  await dialog.getByLabel("Nombre del contacto 1").fill("Contacto de prueba")
  await dialog
    .getByLabel("Correo del contacto 1")
    .fill("contacto@example.invalid")
  await dialog.getByRole("button", { name: "Guardar localmente" }).click()
  await expect(dialog).toHaveCount(0)
  await expect(page.getByLabel("Servicio", { exact: true })).toHaveValue(
    "Preparación de prueba"
  )
  await expect(
    page.getByRole("combobox", { name: "Cliente", exact: true })
  ).toHaveValue("Organización Sintética del Recorrido")
  await page
    .getByLabel("Descripción de línea 1", { exact: true })
    .fill("Servicio sintético")
  await page.getByLabel("Precio unitario (ARS)", { exact: true }).fill("120")
  await page.getByRole("button", { name: "Guardar borrador local" }).click()
  await expect(page.getByRole("heading", { name: /COT-DEM-/ })).toBeVisible()
  await expect(
    page.getByRole("link", {
      name: "Organización Sintética del Recorrido",
      exact: true,
    })
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole("link", {
      name: "Organización Sintética del Recorrido",
      exact: true,
    })
  ).toBeVisible()
  await page
    .getByRole("link", {
      name: "Organización Sintética del Recorrido",
      exact: true,
    })
    .click()
  await expect(
    page.getByRole("heading", {
      name: "Organización Sintética del Recorrido",
      exact: true,
    })
  ).toBeVisible()
  await expect(
    page.getByText("contacto@example.invalid", { exact: true })
  ).toBeVisible()
})

test("@smoke V3 reuses roles without duplicating organizations and preserves inactive history", async ({
  page,
}) => {
  await page.goto("/proveedores")
  await expect(
    page.getByRole("heading", { name: "Proveedores de ABT", exact: true })
  ).toBeVisible()
  await expect(
    page
      .getByRole("list", { name: "Contrapartes de operaciones" })
      .getByText("Vendedor Exterior de Ejemplo", { exact: true })
  ).toHaveCount(0)
  await page
    .getByRole("button", { name: "Nuevo proveedor de ABT", exact: true })
    .click()
  let dialog = page.getByRole("dialog")
  await dialog.getByLabel("Nombre o razón social").fill("Cliente Demo Norte")
  await dialog.getByRole("button", { name: "Guardar localmente" }).click()
  await expect(dialog.getByRole("alert")).toContainText(
    "posibles coincidencias"
  )
  await dialog
    .getByRole("button", {
      name: "Reutilizar Cliente Demo Norte como Proveedor contratado por ABT",
      exact: true,
    })
    .click()
  await expect(dialog).toHaveCount(0)
  await page
    .getByRole("link", { name: "Abrir Cliente Demo Norte", exact: true })
    .click()
  await expect(
    page.getByText("Cliente de ABT · Activo", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByText("Proveedor contratado por ABT · Activo", { exact: true })
  ).toBeVisible()
  page.once("dialog", (d) => d.accept())
  await page
    .getByRole("button", {
      name: "Inactivar Proveedor contratado por ABT",
      exact: true,
    })
    .click()
  await expect(
    page.getByText("Proveedor contratado por ABT · Inactivo", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByText("Cliente de ABT · Activo", { exact: true })
  ).toBeVisible()
  page.once("dialog", (d) => d.accept())
  await page
    .getByRole("button", {
      name: "Reactivar Proveedor contratado por ABT",
      exact: true,
    })
    .click()
  await expect(
    page.getByText("Proveedor contratado por ABT · Activo", { exact: true })
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Abrir ficha de cliente", exact: true })
    .click()
  await expect(
    page.getByRole("link", { name: "Abrir operación" }).first()
  ).toBeVisible()
  await page
    .getByRole("button", { name: "Editar organización", exact: true })
    .click()
  dialog = page.getByRole("dialog")
  await dialog
    .getByLabel("Nombre o razón social")
    .fill("Cliente Norte Actualizado")
  await dialog.getByRole("button", { name: "Guardar localmente" }).click()
  await page.getByRole("link", { name: "Abrir operación" }).first().click()
  await expect(
    page.getByText("Cliente Norte Actualizado", { exact: true }).first()
  ).toBeVisible()
})

test("@smoke V3 supplier and operation-counterparty views remain distinct and fit mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/proveedores?ambito=operacion")
  await expect(
    page.getByText("Vendedor Exterior de Ejemplo", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByText("Servicios Portuarios de Ejemplo", { exact: true })
  ).toHaveCount(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
  await page.getByRole("link", { name: "Abrir ficha", exact: true }).click()
  await expect(page.getByText(/no crea una deuda/)).toBeVisible()
  await expect(page.getByText(/ARS|USD|honorarios|margen/i)).toHaveCount(0)
})
