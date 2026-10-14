import { PortalShell } from "@/features/portal/components/portal-shell"

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PortalShell>{children}</PortalShell>
}
