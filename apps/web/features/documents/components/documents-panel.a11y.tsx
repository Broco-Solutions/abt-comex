import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/react"
import { renderComponent } from "@/test/utils/render"
import { DocumentsPanel } from "./documents-panel"
it("keeps the document reference dialog accessible and restores focus", async () => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    renderComponent(<DocumentsPanel operationId="op-demo-2048" />)
    const trigger = screen.getByRole("button", { name: /Ver referencia/ })
    await userEvent.click(trigger)
    await screen.findByRole("dialog", { name: "Factura comercial" })
    expect(
      (
        await axe(document.body, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    await userEvent.keyboard("{Escape}")
    expect(trigger).toHaveFocus()
  } finally {
    canvas.mockRestore()
  }
})
