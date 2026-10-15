import { screen, fireEvent } from "@testing-library/react"
import { expect, it } from "vitest"
import { renderComponent } from "@/test/utils/render"
import { DocumentsPanel } from "./documents-panel"
import {
  documentRequirements,
  type DocumentRequirement,
} from "../data/documents"
it.each([2, 20, 100])(
  "keeps a compact requirement list searchable at synthetic design volume %i",
  async (count) => {
    const requirements: DocumentRequirement[] = Array.from(
      { length: count },
      (_, i) => ({
        ...documentRequirements[0]!,
        id: "volume-" + i,
        requirement: "Requisito de prueba " + i,
      })
    )
    renderComponent(
      <DocumentsPanel operationId="op-demo-2048" requirements={requirements} />
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(Math.min(count, 20))
    if (count > 6) {
      fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "prueba " + (count - 1) },
      })
      expect(screen.getAllByRole("listitem")).toHaveLength(1)
    } else expect(screen.queryByRole("searchbox")).not.toBeInTheDocument()
  }
)
