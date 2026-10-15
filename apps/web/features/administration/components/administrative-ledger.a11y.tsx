import { expect, it, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { renderComponent } from "@/test/utils/render"
import { ExpensesPage } from "./expenses-page"
import { MovementsPage } from "./movements-page"
import { RenditionsPage } from "./renditions-page"
import { CategoriesPage } from "./categories-page"
import { ExpenseEditor } from "./expense-editor"
import { MovementEditor } from "./movement-editor"
import { RenditionEditor } from "./rendition-editor"
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/administracion",
  useRouter: () => ({ push: vi.fn() }),
}))
it("keeps administrative lists and preparation dialogs accessible", async () => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    for (const node of [
      <ExpensesPage key="expenses" />,
      <MovementsPage key="movements" />,
      <RenditionsPage key="renditions" />,
      <CategoriesPage key="categories" />,
    ]) {
      const rendered = renderComponent(node)
      expect(
        (
          await axe(rendered.container, {
            rules: { "color-contrast": { enabled: false } },
          })
        ).violations
      ).toEqual([])
      rendered.unmount()
    }
    for (const [node, title] of [
      [<ExpenseEditor key="expense" />, "Nuevo gasto"],
      [<MovementEditor key="movement" />, "Nuevo movimiento"],
      [<RenditionEditor key="rendition" />, "Nueva rendición"],
    ] as const) {
      const rendered = renderComponent(node)
      await userEvent.click(rendered.getByRole("button", { name: title }))
      expect(
        (
          await axe(document.body, {
            rules: { "color-contrast": { enabled: false } },
          })
        ).violations
      ).toEqual([])
      rendered.unmount()
    }
  } finally {
    canvas.mockRestore()
  }
})
