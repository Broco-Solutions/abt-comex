import { expect, it } from "vitest"
import userEvent from "@testing-library/user-event"

import { demonstrationOperations } from "@/features/operations/data/operations"
import { renderComponent } from "@/test/utils/render"
import { AssistedQueries } from "./assisted-queries"

it("answers only the selected guided query and exposes its source and limits", async () => {
  const user = userEvent.setup()
  const operation = demonstrationOperations[0]
  if (!operation) throw new Error("Expected a synthetic operation fixture")
  const rendered = renderComponent(<AssistedQueries operation={operation} />)

  expect(
    rendered.getByText("No se consultó información todavía.")
  ).toBeVisible()
  await user.click(
    rendered.getByRole("button", {
      name: "¿Se confirmó el estado aduanero?",
    })
  )

  expect(rendered.getByRole("status")).toHaveTextContent(
    "Alpha2000 y ARCA/MOA no están conectados"
  )
  expect(rendered.getByText("Sin consulta a fuente externa")).toBeVisible()
  expect(rendered.getByText("No disponible")).toBeVisible()
  expect(rendered.getByText(/no acredita permisos reales/i)).toBeVisible()
  expect(rendered.queryByText(/\$\s?\d/)).not.toBeInTheDocument()
})
