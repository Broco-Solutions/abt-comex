import { expect, test } from "../fixtures"
test("@smoke V3 category lifecycle preserves recorded names and stable analytical links", async ({
  page,
}) => {
  await page.goto("/administracion/categorias")
  const category = page
    .getByRole("list", { name: "Categorías administrativas" })
    .getByRole("listitem")
    .filter({ hasText: "Gastos generales" })
  page.once("dialog", (dialog) => dialog.accept())
  await category.getByRole("button", { name: "Inactivar", exact: true }).click()
  await expect(category).toHaveCount(0)
  await page.getByLabel("Incluir inactivas").check()
  await expect(category).toContainText("Inactiva")
  await page.goto("/administracion/gastos")
  await page.getByRole("button", { name: "Nuevo gasto", exact: true }).click()
  const expense = page.getByRole("dialog", {
    name: "Preparar gasto",
    exact: true,
  })
  await expense
    .getByRole("combobox", { name: "Categoría de gasto", exact: true })
    .fill("Gastos generales")
  await expect(
    expense.getByRole("option", { name: "Gastos generales", exact: true })
  ).toHaveCount(0)
  await expense.getByRole("button", { name: "Cancelar", exact: true }).click()
  await page.goto("/administracion/categorias")
  await page.getByLabel("Incluir inactivas").check()
  page.once("dialog", (dialog) => dialog.accept())
  await category.getByRole("button", { name: "Reactivar", exact: true }).click()
  await category
    .getByRole("button", { name: "Editar categoría", exact: true })
    .click()
  const editor = page.getByRole("dialog", {
    name: "Editar categoría",
    exact: true,
  })
  await editor
    .getByLabel("Nombre de categoría")
    .fill("Gastos generales revisados")
  await editor
    .getByRole("button", { name: "Guardar categoría", exact: true })
    .click()
  await page.goto("/administracion/gastos/expense-demo-general-01")
  await expect(
    page.getByText("Al registrar: Gastos generales", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByText("Gastos generales revisados", { exact: true })
  ).toBeVisible()
  await page.goto(
    "/administracion/finanzas?desde=2026-10-01&hasta=2026-10-14&moneda=ARS&serie=expense&dimension=category&grupo=category-demo-general#registros"
  )
  await expect(
    page.getByRole("list", { name: "Registros financieros seleccionados" })
  ).toContainText("GAS-LOCAL-001")
  await expect(page.getByRole("main")).toContainText(
    "Gastos generales revisados"
  )
})
test("@smoke V3 paginated expenses keep local filters, focus and return context", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/administracion/gastos")
  let documents = 0
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await page.getByRole("button", { name: "Siguiente", exact: true }).click()
  await expect(page).toHaveURL(/pagina=2$/)
  const first = page
    .getByRole("list", { name: "Gastos registrados" })
    .getByRole("link")
    .first()
  const reference = await first.textContent()
  await first.click()
  await page.getByRole("link", { name: "Volver a Gastos", exact: true }).click()
  await expect(page).toHaveURL(/pagina=2$/)
  await expect(
    page
      .getByRole("list", { name: "Gastos registrados" })
      .getByRole("link", { name: reference!, exact: true })
  ).toBeFocused()
  await page.getByLabel("Buscar gasto").fill("Insumos")
  await expect(page).toHaveURL(/q=Insumos$/)
  await expect(
    page.getByRole("list", { name: "Gastos registrados" })
  ).toContainText("GAS-LOCAL-001")
  expect(documents).toBe(0)
})
test("@smoke V3 prepares an advance and rendition with a contextual expense and no external settlement", async ({
  page,
}) => {
  await page.goto("/administracion/movimientos")
  await page
    .getByRole("button", { name: "Nuevo movimiento", exact: true })
    .click()
  const movement = page.getByRole("dialog", {
    name: "Preparar movimiento",
    exact: true,
  })
  await movement
    .getByRole("combobox", { name: "Naturaleza del movimiento" })
    .selectOption("Anticipo entregado")
  await movement.getByLabel("Importe", { exact: true }).fill("300.25")
  await movement
    .getByRole("combobox", { name: "Categoría del movimiento" })
    .fill("Egresos sin")
  await movement
    .getByRole("option", {
      name: "Egresos sin clasificación definitiva",
      exact: true,
    })
    .click()
  await movement
    .getByRole("button", { name: "Guardar movimiento local" })
    .click()
  await page.goto("/administracion/rendiciones")
  await page
    .getByRole("button", { name: "Nueva rendición", exact: true })
    .click()
  const rendition = page.getByRole("dialog", {
    name: "Preparar rendición",
    exact: true,
  })
  await rendition
    .getByRole("combobox", { name: "Anticipo entregado", exact: true })
    .fill("MOV-LOCAL-001")
  await rendition.getByRole("option", { name: /MOV-LOCAL-001/ }).click()
  await expect(
    rendition.getByLabel(/Importe del anticipo aplicado/)
  ).toHaveValue("300.25")
  await rendition
    .getByRole("button", { name: "Nuevo gasto", exact: true })
    .click()
  const expense = page.getByRole("dialog", {
    name: "Preparar gasto",
    exact: true,
  })
  await expense
    .getByLabel("Concepto del gasto")
    .fill("Gasto relacionado con anticipo")
  await expense.getByLabel("Importe", { exact: true }).fill("200.25")
  await expense
    .getByRole("combobox", { name: "Categoría de gasto", exact: true })
    .fill("Gastos generales")
  await expense
    .getByRole("option", { name: "Gastos generales", exact: true })
    .click()
  await expense.getByRole("button", { name: "Guardar gasto local" }).click()
  await expect(
    rendition.getByLabel(/Importe del anticipo aplicado/)
  ).toHaveValue("300.25")
  await rendition
    .getByRole("button", { name: "Guardar rendición local" })
    .click()
  await page.getByRole("link", { name: "Abrir rendición", exact: true }).click()
  await expect(
    page.getByRole("heading", { name: "REN-LOCAL-001", exact: true })
  ).toBeVisible()
  await expect(page.getByRole("main")).toContainText("100,00")
  await expect(
    page.getByText("Con evidencias pendientes", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: /Aprobar|Contabilizar|Transferir/ })
  ).toHaveCount(0)
})
test("@smoke V3 creates category and supplier inside an expense, preserves the draft and drills from the same chart", async ({
  page,
}) => {
  await page.goto("/administracion/gastos")
  await page.getByRole("button", { name: "Nuevo gasto", exact: true }).click()
  const expense = page.getByRole("dialog", {
    name: "Preparar gasto",
    exact: true,
  })
  await expense
    .getByLabel("Concepto del gasto")
    .fill("Servicio de evaluación V3")
  await expense.getByLabel("Importe", { exact: true }).fill("123.45")
  await expense
    .getByRole("button", { name: "Nueva categoría", exact: true })
    .click()
  const category = page.getByRole("dialog", {
    name: "Nueva categoría",
    exact: true,
  })
  await category
    .getByLabel("Nombre de categoría")
    .fill("Categoría sintética V3")
  await category.getByRole("button", { name: "Guardar categoría" }).click()
  await expect(expense.getByLabel("Concepto del gasto")).toHaveValue(
    "Servicio de evaluación V3"
  )
  await expect(
    expense.getByRole("combobox", { name: "Categoría de gasto" })
  ).toHaveValue("Categoría sintética V3")
  await expense
    .getByRole("button", { name: "Nuevo proveedor de ABT", exact: true })
    .click()
  const supplier = page.getByRole("dialog", {
    name: "Crear organización",
    exact: true,
  })
  await supplier
    .getByLabel("Nombre o razón social *", { exact: true })
    .fill("Proveedor sintético V3")
  await supplier.getByRole("button", { name: "Guardar localmente" }).click()
  await expect(
    expense.getByRole("combobox", {
      name: "Proveedor contratado por ABT · opcional",
    })
  ).toHaveValue("Proveedor sintético V3")
  await expense.getByRole("button", { name: "Guardar gasto local" }).click()
  await page.getByRole("link", { name: "Abrir gasto", exact: true }).click()
  await expect(page.getByRole("main")).toContainText("123,45")
  await expect(
    page.getByText("Gasto general, sin operación vinculada.")
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Proveedor sintético V3", exact: true })
    .click()
  await expect(
    page.getByRole("heading", { name: "Relaciones administrativas" })
  ).toBeVisible()
  await page
    .getByRole("link", { name: "Volver al contexto anterior", exact: true })
    .click()
  await expect(
    page.getByRole("heading", { name: "GAS-LOCAL-002", exact: true })
  ).toBeVisible()
  await page.goto(
    "/administracion/finanzas?desde=2026-10-01&hasta=2026-10-14&moneda=ARS&serie=expense&dimension=category&grupo=Categor%C3%ADa+sint%C3%A9tica+V3#registros"
  )
  const records = page.getByRole("list", {
    name: "Registros financieros seleccionados",
  })
  await expect(records).toContainText("123,45")
  await records
    .getByRole("link", { name: "GAS-LOCAL-002", exact: true })
    .click()
  await page
    .getByRole("link", { name: "Volver al análisis", exact: true })
    .click()
  await expect(page).toHaveURL(/grupo=Categor.*#registros$/)
})
test("@smoke V3 expense evidence updates rendition and clears the same administrative pending without an operation", async ({
  page,
}) => {
  await page.goto("/administracion/rendiciones/rendition-demo-014")
  await expect(
    page.getByText("Con evidencias pendientes", { exact: true })
  ).toBeVisible()
  await page
    .getByRole("link", {
      name: "GAS-LOCAL-001 · Insumos de oficina",
      exact: true,
    })
    .click()
  await page.getByRole("button", { name: "Editar gasto", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "Editar gasto", exact: true })
  await dialog
    .getByLabel("Referencia de comprobante o evidencia")
    .fill("REC-EVAL-OFICINA")
  await dialog.getByRole("button", { name: "Guardar gasto local" }).click()
  await page
    .getByRole("link", { name: "Volver a la rendición", exact: true })
    .click()
  await expect(
    page.getByText("Preparada para revisión", { exact: true })
  ).toBeVisible()
  await page.goto("/mi-trabajo?q=Completar+referencia+de+una+rendici%C3%B3n")
  await expect(
    page.getByRole("heading", {
      name: "Completar referencia de una rendición",
      exact: true,
    })
  ).toHaveCount(0)
  await page.goto("/administracion")
  await expect(
    page.getByRole("link", { name: "Abrir REN-DEM-014", exact: true })
  ).toHaveCount(0)
})
test("@smoke V3 creates a local receipt and exposes the same record and contextual client return", async ({
  page,
}) => {
  await page.goto("/administracion/movimientos")
  await page
    .getByRole("button", { name: "Nuevo movimiento", exact: true })
    .click()
  const dialog = page.getByRole("dialog", {
    name: "Preparar movimiento",
    exact: true,
  })
  await dialog.getByLabel("Importe", { exact: true }).fill("200.25")
  await dialog
    .getByRole("combobox", { name: "Categoría del movimiento" })
    .fill("Ingresos sin")
  await dialog
    .getByRole("option", {
      name: "Ingresos sin clasificación definitiva",
      exact: true,
    })
    .click()
  await dialog
    .getByRole("combobox", { name: "Cliente del movimiento" })
    .fill("Cliente Demo Norte")
  await dialog.getByRole("option", { name: /Cliente Demo Norte/ }).click()
  await dialog.getByRole("button", { name: "Guardar movimiento local" }).click()
  await page
    .getByRole("link", { name: "Abrir movimiento", exact: true })
    .click()
  await expect(page.getByRole("main")).toContainText("200,25")
  await page
    .getByRole("link", { name: "Cliente Demo Norte", exact: true })
    .click()
  await page
    .getByRole("link", { name: "Volver al contexto anterior", exact: true })
    .click()
  await expect(
    page.getByRole("heading", { name: "MOV-LOCAL-001", exact: true })
  ).toBeVisible()
  await page.goto(
    "/administracion/finanzas?desde=2026-10-01&hasta=2026-10-14&moneda=ARS&serie=receipt&dimension=all#registros"
  )
  await expect(
    page.getByRole("list", { name: "Registros financieros seleccionados" })
  ).toContainText("200,25")
  await expect(
    page.getByRole("link", { name: "MOV-LOCAL-001", exact: true })
  ).toBeVisible()
})
test("@smoke V3 financial preparation remains unavailable to operational perspectives", async ({
  page,
}) => {
  await page.goto("/acceso/escenarios")
  await page.getByRole("button", { name: /Responsable operativo/ }).click()
  for (const path of [
    "/administracion/gastos",
    "/administracion/movimientos",
    "/administracion/rendiciones/rendition-demo-014",
  ]) {
    await page.goto(path)
    await expect(
      page.getByRole("heading", { name: "Vista no disponible" })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: /Guardar|Nuevo gasto/ })
    ).toHaveCount(0)
    await expect(
      page.getByText(/15\.000|5\.000|123,45|ANT-LOCAL-001/)
    ).toHaveCount(0)
  }
})
