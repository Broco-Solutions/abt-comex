import { screen } from "@testing-library/react"
import { expect, it } from "vitest"

import { Button } from "@workspace/ui/components/button"
import { renderComponent } from "@/test/utils/render"
import { PageHeader } from "./page-header"

it("renders optional context and actions without forcing them", () => {
  renderComponent(
    <PageHeader
      eyebrow="Contexto"
      title="Operaciones"
      description="Seguimiento del núcleo operativo."
      status={<span>En revisión</span>}
      primaryAction={<Button>Acción principal</Button>}
      secondaryActions={<Button variant="outline">Acción secundaria</Button>}
    />
  )

  expect(
    screen.getByRole("heading", { level: 1, name: "Operaciones" })
  ).toBeVisible()
  expect(screen.getByText("Contexto")).toBeVisible()
  expect(screen.getByText("En revisión")).toBeVisible()
  expect(screen.getByRole("button", { name: "Acción principal" })).toBeVisible()
})
