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
      size={compact ? "icon-lg" : "default"}
      aria-label={toggleLabel}
      onClick={toggleMode}
      className={cn(
        "min-h-11 text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
        compact ? "mx-auto size-11" : "w-full justify-start gap-3 px-3"
      )}
    >
      {compact ? (
        <PanelLeftOpen aria-hidden="true" />
      ) : (
        <PanelLeftClose aria-hidden="true" />
      )}
      {compact ? null : <span>{toggleLabel}</span>}
    </Button>
  )

  return (
    <TooltipProvider>
      <div
        data-sidebar-mode={mode}
        data-sidebar-presentation={presentation}
        className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground"
      >
        <div
          className={cn(
            "flex min-h-20 items-center border-b border-sidebar-border",
            compact ? "justify-center px-2" : "px-5"
          )}
        >
          <AbtBrand compact={compact} />
        </div>
        <nav
          aria-label="Navegación principal"
          className={cn(
            "min-h-0 flex-1 overflow-y-auto py-4",
            compact ? "px-2" : "px-3"
          )}
        >
          {presentation === "inline" && showModeControl ? (
            <div className="mb-3 border-b border-sidebar-border pb-3">
              <Tooltip disabled={!compact}>
                <TooltipTrigger render={modeControl} />
                <TooltipContent>{toggleLabel}</TooltipContent>
              </Tooltip>
            </div>
          ) : null}
          <ul className="space-y-1">
            {appNavigation.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                activeId={activeId}
                compact={compact}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </nav>
        <div
          className={cn(
            "flex border-t border-sidebar-border p-3",
            compact && "justify-center px-2"
          )}
        >
          <BrandAttribution compact={compact} />
        </div>
      </div>
    </TooltipProvider>
  )
}
