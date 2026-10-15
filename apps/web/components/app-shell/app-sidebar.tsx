"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { BrandAttribution } from "../brand/brand-attribution"
import { AbtBrand } from "../brand/abt-brand"
import {
  appNavigation,
  resolveActiveNavigation,
} from "../navigation/app-navigation"
import { NavigationItem } from "../navigation/navigation-item"
import { useAppShellState, type NavigationMode } from "./app-shell-state"

import { useScenario } from "@/features/demo/state/scenario-provider"
import { canVisit, scenarioKind } from "@/features/demo/data/scenarios"
import { useWorkItems } from "@/features/work/state/use-work-items"
import { usePeople } from "@/features/people/state/use-people"
import { UserMenu } from "./user-menu"

const groups = [
  { label: "Operación diaria", ids: ["inicio", "mi-trabajo", "operaciones"] },
  { label: "Registros", ids: ["clientes", "proveedores"] },
  { label: "Gestión", ids: ["administracion", "gestion"] },
]

export function AppSidebar({
  activeIdOverride,
  modeOverride,
  onNavigate,
  presentation = "inline",
  showModeControl = true,
}: {
  activeIdOverride?: string | null
  modeOverride?: NavigationMode
  onNavigate?: () => void
  presentation?: "inline" | "overlay"
  showModeControl?: boolean
}) {
  const { scenario } = useScenario()
  const workItems = useWorkItems()
  const { state: people } = usePeople()
  const isMember = people.members.some(
    (member) => member.id === scenario.memberId
  )
  const pendingCount = workItems.filter(
    (item) => !isMember || people.assignments[item.id] === scenario.memberId
  ).length
  const kind = scenarioKind(scenario)
  const navigation = appNavigation
    .filter((item) => canVisit(scenario, item.href))
    .map((item) => ({
      ...item,
      pendingCount: item.id === "mi-trabajo" ? pendingCount : undefined,
      children: item.children?.filter(
        (child) =>
          canVisit(scenario, child.href) &&
          (item.id !== "operaciones" ||
            !kind ||
            child.href.includes(
              kind === "Importación" ? "importacion" : "exportacion"
            ))
      ),
    }))
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { mode: preferredMode, toggleMode } = useAppShellState()
  const mode =
    presentation === "overlay" ? "expanded" : (modeOverride ?? preferredMode)
  const compact = mode === "compact"
  const activeId =
    activeIdOverride === undefined
      ? resolveActiveNavigation(pathname, searchParams)
      : activeIdOverride
  const toggleLabel = compact ? "Expandir navegación" : "Contraer navegación"

  const modeControl = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={toggleLabel}
      onClick={toggleMode}
      className={cn(
        "size-9 shrink-0 text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
      )}
    >
      {compact ? (
        <PanelLeftOpen aria-hidden="true" />
      ) : (
        <PanelLeftClose aria-hidden="true" />
      )}
    </Button>
  )

  return (
    <TooltipProvider>
      <div
        data-sidebar-mode={mode}
        data-sidebar-presentation={presentation}
        className="app-sidebar-surface flex h-full min-h-0 flex-col text-sidebar-foreground"
      >
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-sidebar-border",
            compact
              ? "min-h-24 flex-col justify-center gap-1 px-2 py-2"
              : "min-h-20 justify-between gap-2 px-4"
          )}
        >
          <AbtBrand compact={compact} />
          {presentation === "inline" && showModeControl ? (
            <Tooltip>
              <TooltipTrigger render={modeControl} />
              <TooltipContent>{toggleLabel}</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        <nav
          aria-label="Navegación principal"
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain py-3 [scrollbar-width:thin]",
            compact ? "px-2" : "px-3"
          )}
        >
          {groups.map((group) => {
            const items = navigation.filter((item) =>
              group.ids.includes(item.id)
            )
            if (!items.length) return null
            return (
              <section
                key={group.label}
                aria-label={group.label}
                className="mb-4 last:mb-0"
              >
                <h2
                  className={
                    compact
                      ? "sr-only"
                      : "px-3 pt-1 pb-2 text-xs font-semibold tracking-wider text-sidebar-foreground/65 uppercase"
                  }
                >
                  {group.label}
                </h2>
                {compact ? (
                  <div
                    aria-hidden="true"
                    className="mx-2 mb-2 border-t border-sidebar-border"
                  />
                ) : null}
                <ul className="space-y-0.5">
                  {items.map((item) => (
                    <NavigationItem
                      key={item.id}
                      item={item}
                      activeId={activeId}
                      compact={compact}
                      onNavigate={onNavigate}
                    />
                  ))}
                </ul>
              </section>
            )
          })}
        </nav>
        <div
          className={cn(
            "shrink-0 border-t border-sidebar-border bg-black/10 px-3 pt-2 pb-3",
            compact && "px-2"
          )}
        >
          <nav aria-label="Configuración y cuenta">
            <ul>
              {navigation
                .filter((item) => item.id === "configuracion")
                .map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    activeId={activeId}
                    compact={compact}
                    onNavigate={onNavigate}
                  />
                ))}
            </ul>
            <div className="mt-1">
              <UserMenu compact={compact} onNavigate={onNavigate} />
            </div>
          </nav>
          <div
            className={cn(
              "mt-2 flex border-t border-sidebar-border pt-2",
              compact ? "justify-center" : "px-2"
            )}
          >
            <BrandAttribution compact={compact} inverted />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
