import { expect, it, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { renderComponent } from "@/test/utils/render"
import { OrganizationList } from "./organization-list"
import { OrganizationEditor } from "./organization-editor"

it("keeps supplier lists and the organization form accessible", async () => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const list = renderComponent(
      <OrganizationList role="operation-party" searchParams={{}} />
    )
    expect(
      (
        await axe(list.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    list.unmount()
    const editor = renderComponent(<OrganizationEditor />)
    await userEvent.click(editor.getByRole("button", { name: "Nuevo cliente" }))
    expect(
      (
        await axe(document.body, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    editor.unmount()
  } finally {
    canvas.mockRestore()
  }
})
