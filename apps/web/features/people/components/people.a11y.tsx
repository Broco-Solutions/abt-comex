import { expect, it, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { renderComponent } from "@/test/utils/render"
import { PeopleList } from "./people-list"
import { TeamsList } from "./teams-list"
import { AccessPage } from "@/features/demo/components/access-page"
import { RecoverAccess } from "@/features/demo/components/recover-access"
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))
it("keeps people, member form, team and conventional access accessible", async () => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const people = renderComponent(<PeopleList />)
    await userEvent.click(
      people.getByRole("button", { name: "Nuevo integrante" })
    )
    expect(
      (
        await axe(document.body, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    people.unmount()
    for (const node of [
      <TeamsList key="team" />,
      <AccessPage key="access" />,
      <RecoverAccess key="recover" />,
      <RecoverAccess reset key="reset" />,
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
  } finally {
    canvas.mockRestore()
  }
})
