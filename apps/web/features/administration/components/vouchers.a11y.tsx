import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import userEvent from "@testing-library/user-event"
import { renderComponent } from "@/test/utils/render"
import { VoucherList } from "./voucher-list"
import { VoucherDetail } from "./voucher-detail"
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/administracion/comprobantes",
  useRouter: () => ({ push: vi.fn() }),
}))
it("keeps document lists, portfolio, detail and preparation accessible", async () => {
  for (const node of [
    <VoucherList key="list" />,
    <VoucherList key="portfolio" cartera />,
    <VoucherDetail key="detail" id="purchase-demo-01" />,
  ]) {
    const view = renderComponent(node)
    expect(
      (
        await axe(view.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    if (view.queryByRole("button", { name: "Nuevo comprobante" })) {
      await userEvent.click(
        view.getByRole("button", { name: "Nuevo comprobante" })
      )
      expect(
        (
          await axe(document.body, {
            rules: { "color-contrast": { enabled: false } },
          })
        ).violations
      ).toEqual([])
    }
    view.unmount()
  }
})
