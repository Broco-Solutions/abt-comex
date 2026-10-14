import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import userEvent from "@testing-library/user-event"

import { demonstrationOperations } from "@/features/operations/data/operations"
import { renderComponent } from "@/test/utils/render"
import { AssistedQueries } from "./assisted-queries"

it("has no known automated violations before and after a guided response", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const user = userEvent.setup()
    const operation = demonstrationOperations[0]
    if (!operation) throw new Error("Expected a synthetic operation fixture")
    const rendered = renderComponent(<AssistedQueries operation={operation} />)
    const initial = await axe(rendered.container, {
      rules: { "color-contrast": { enabled: false } },
    })
    expect(initial.violations).toEqual([])

    await user.click(
      rendered.getByRole("button", { name: "¿Qué documento falta?" })
    )
    const answered = await axe(rendered.container, {
      rules: { "color-contrast": { enabled: false } },
    })
    expect(answered.violations).toEqual([])
    rendered.unmount()
  } finally {
    canvasContext.mockRestore()
  }
})
