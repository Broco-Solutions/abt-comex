import { test, expect } from "../fixtures"

test("@smoke local Direction query shares exact USD records, event references and a returnable URL", async ({
  page,
}) => {
  await page.goto("/gestion")
  await page
    .getByRole("link", { name: "Consultas (demo)", exact: true })
    .click()
  await expect(
    page.getByRole("heading", { name: "Consultas de Dirección" })
  ).toBeVisible()
  await expect(
    page.getByText(
      "Demostración local con datos sintéticos. No consulta sistemas externos ni utiliza un proveedor de IA"
    )
  ).toBeVisible()
  let documents = 0
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await page.getByLabel("Tu pregunta").fill("¿Cuánto facturamos este mes?")
  await page.getByRole("button", { name: "Consultar", exact: true }).click()
  const answer = page.getByRole("region", { name: "Respuesta a la consulta" })
  await expect(answer).toContainText("Se facturaron USD 2.059,91")
  await expect(answer).toContainText("5 registros de respaldo")
  await expect(answer).toBeFocused()
  await expect(page).toHaveURL(
    /vista=consultas.*pregunta=.*desde=2026-10-01.*hasta=2026-10-14/
  )
  const queryUrl = page.url()
  await page.getByRole("link", { name: "Ver registros", exact: true }).click()
  const records = page.getByRole("list", {
    name: "Registros financieros seleccionados",
  })
  await expect(records.getByRole("listitem")).toHaveCount(5)
  await expect(records).toContainText("Original: ARS 275.000,00")
  await expect(records).toContainText("Original: USD 1.275,00")
  expect(documents).toBe(0)
  await records
    .getByRole("link", { name: "FAC-EVAL-3107", exact: true })
    .click()
  await page.getByText(/Equivalente de gestión:/).click()
  await expect(
    page.getByText(/1325 ARS por USD/).filter({ visible: true })
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Volver a la consulta", exact: true })
    .click()
  await expect(page).toHaveURL(queryUrl + "#registros-consulta")
  await expect(page.getByLabel("Tu pregunta")).toHaveValue(
    "¿Cuánto facturamos este mes?"
  )
})

test("@smoke query clarifies ambiguity, accepts client filters and preserves authoritative filters after date words", async ({
  page,
}) => {
  await page.goto("/gestion?vista=consultas")
  await page.getByLabel("Tu pregunta").fill("ingresos")
  await page.getByRole("button", { name: "Consultar", exact: true }).click()
  await expect(
    page.getByRole("heading", { name: "Necesito una aclaración" })
  ).toBeVisible()
  await page
    .getByRole("region", { name: "Respuesta a la consulta" })
    .getByRole("button", { name: "Facturación", exact: true })
    .click()
  await expect(
    page.getByRole("region", { name: "Respuesta a la consulta" })
  ).toContainText("USD 2.059,91")
  await page
    .getByLabel("Tu pregunta")
    .fill("Cuánto se facturó a Demo en este período")
  await page.getByRole("button", { name: "Consultar", exact: true }).click()
  await expect(
    page.getByRole("heading", { name: "Cliente ambiguo" })
  ).toBeVisible()
  await page
    .getByRole("region", { name: "Respuesta a la consulta" })
    .getByRole("button", { name: "Cliente Demo Norte", exact: true })
    .click()
  await expect(
    page.getByRole("region", { name: "Respuesta a la consulta" })
  ).toContainText("USD 207,55")
  await page
    .getByLabel("Período", { exact: true })
    .selectOption("previous-month")
  await expect(
    page.getByRole("region", { name: "Respuesta a la consulta" })
  ).toContainText("01/09/2026 al 30/09/2026")
  await page
    .getByLabel("Tu pregunta")
    .fill("Cuántas operaciones tiene el cliente seleccionado")
  await page.getByRole("button", { name: "Consultar", exact: true }).click()
  await expect(
    page.getByRole("region", { name: "Respuesta a la consulta" })
  ).toContainText("No se aplicó un filtro temporal")
})

test("@smoke local query has explicit negative states, no forbidden population and usable mobile controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/gestion?vista=consultas")
  await expect(page.getByLabel("Vista de Dirección")).toHaveValue("consultas")
  for (const [question, state] of [
    ["Cuál es el margen neto", "Pregunta no admitida"],
    ["Cuánto facturamos entre 31/02/2026 y 14/10/2026", "Fecha inválida"],
    ["Cuánto se cobró del cliente seleccionado", "Datos incompletos"],
  ]) {
    if (state === "Datos incompletos")
      await page
        .getByLabel("Período", { exact: true })
        .selectOption("this-month")
    await page.getByLabel("Tu pregunta").fill(question!)
    await page.getByRole("button", { name: "Consultar", exact: true }).click()
    await expect(
      page.getByRole("heading", { name: state!, exact: true })
    ).toBeVisible()
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
  await page.goto(
    "/gestion?vista=consultas&error=lectura&pregunta=Cuanto+facturamos"
  )
  await expect(
    page.getByRole("heading", { name: "Error de lectura", exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("list", { name: "Registros financieros seleccionados" })
  ).toHaveCount(0)
  await page.goto("/acceso/escenarios")
  await page.getByRole("button", { name: /Operador de Importación/ }).click()
  await page.goto("/gestion?vista=consultas&pregunta=Cuanto+facturamos")
  await expect(page.getByLabel("Tu pregunta")).toHaveCount(0)
  await expect(page.getByText(/USD\s*\d/)).toHaveCount(0)
  await expect(
    page.getByRole("link", { name: "Ver registros", exact: true })
  ).toHaveCount(0)
})

test("@smoke missing management rate and incomplete invoice balance abstain while retaining explanatory originals", async ({
  page,
}) => {
  await page.goto(
    "/gestion?vista=consultas&pregunta=" +
      encodeURIComponent(
        "Qué saldo abierto de facturas tiene Cliente Demo Centro al corte"
      )
  )
  await expect(
    page.getByRole("heading", { name: "Datos incompletos", exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("region", { name: "Respuesta a la consulta" })
  ).not.toContainText(/USD\s*\d/)
  await expect(
    page.getByRole("list", { name: "Obligaciones del análisis al corte" })
  ).toContainText("Saldo pendiente de informar")
  await page.goto("/configuracion/cotizaciones-gestion")
  await page
    .getByRole("button", { name: "Editar referencia del 01/10/2026" })
    .click()
  const dialog = page.getByRole("dialog")
  await dialog.getByLabel("Referencia válida").uncheck()
  await dialog.getByRole("button", { name: "Guardar referencia local" }).click()
  await page.goto(
    "/gestion?vista=consultas&pregunta=" +
      encodeURIComponent("Cuánto facturamos este mes")
  )
  await expect(
    page.getByRole("heading", {
      name: "Referencia de cambio pendiente",
      exact: true,
    })
  ).toBeVisible()
  const answer = page.getByRole("region", { name: "Respuesta a la consulta" })
  await expect(answer).toContainText("no se publica un total parcial")
  await expect(answer).not.toContainText(/USD\s*\d/)
  await expect(
    page.getByRole("list", { name: "Registros financieros seleccionados" })
  ).toContainText("Original: ARS")
})
