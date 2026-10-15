"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import type { NavigationItem as NavigationItemType } from "./app-navigation"

type NavigationState = "selected" | "section-active" | "inactive"

export function NavigationItem({
  item,
  activeId,
  compact = false,
  onNavigate,
  depth = 0,
}: {
  item: NavigationItemType
  activeId: string | null
  compact?: boolean
  onNavigate?: () => void
  depth?: 0 | 1
}) {
  const isSelected = item.id === activeId
  const [expanded, setExpanded] = React.useState(true)
  const childrenId = React.useId()
  const isSectionActive = Boolean(
    !isSelected && item.children?.some((child) => child.id === activeId)
  )
  const navigationState: NavigationState = isSelected
    ? "selected"
    : isSectionActive
      ? "section-active"
      : "inactive"

  if (compact && item.children?.length) {
    return (
      <CompactNavigationGroup
        item={item}
        activeId={activeId}
        navigationState={navigationState}
        onNavigate={onNavigate}
      />
    )
  }

  if (compact) {
    return (
      <CompactNavigationLink
        item={item}
        navigationState={navigationState}
        onNavigate={onNavigate}
      />
    )
  }

  if (item.children?.length) {
    return (
      <li>
        <div className="flex items-center gap-1">
          <div className="min-w-0 flex-1">
            <ExpandedNavigationLink
              item={item}
              navigationState={navigationState}
              onNavigate={onNavigate}
            />
          </div>
          <button
            type="button"
            aria-label={`${expanded ? "Contraer" : "Expandir"} ${item.label}`}
            aria-expanded={expanded}
            aria-controls={childrenId}
            onClick={() => setExpanded(!expanded)}
            className="flex size-11 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/85 hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
          >
            <ChevronRight
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform motion-reduce:transition-none",
                expanded && "rotate-90"
              )}
            />
          </button>
        </div>
        <ul
          id={childrenId}
          hidden={!expanded}
          className="ml-5 border-l border-sidebar-border py-1 pl-3"
        >
          {item.children.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              activeId={activeId}
              onNavigate={onNavigate}
              depth={1}
            />
          ))}
        </ul>
      </li>
    )
  }

  return (
    <li
      data-navigation-separator={item.separatorAfter ? "after" : undefined}
      className={cn(
        item.separatorAfter && "mb-3 border-b border-sidebar-border pb-3"
      )}
    >
      <ExpandedNavigationLink
        item={item}
        navigationState={navigationState}
        onNavigate={onNavigate}
        depth={depth}
      />
    </li>
  )
}

function ExpandedNavigationLink({
  item,
  navigationState,
  onNavigate,
  depth = 0,
}: {
  item: NavigationItemType
  navigationState: NavigationState
  onNavigate?: () => void
  depth?: 0 | 1
}) {
  const Icon = item.icon
  const selected = navigationState === "selected"

  return (
    <Link
      href={item.href}
      aria-current={selected ? "page" : undefined}
      data-navigation-state={navigationState}
      data-navigation-level={depth === 0 ? "primary" : "secondary"}
      onClick={onNavigate}
      className={cn(
        "group flex min-h-11 items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
        selected &&
          "border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-foreground",
        navigationState === "section-active" &&
          "border-transparent bg-sidebar-accent/45 font-semibold text-sidebar-foreground hover:bg-sidebar-accent",
        navigationState === "inactive" &&
          (depth === 0
            ? "border-transparent font-medium text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            : "border-transparent font-normal text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground")
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className={cn(
            "size-4",
            navigationState === "inactive"
              ? "text-sidebar-foreground/65"
              : "text-sidebar-primary"
          )}
        />
      ) : null}
      <span className="min-w-0 flex-1">{item.label}</span>
      {selected ? <ChevronRight aria-hidden="true" className="size-4" /> : null}
    </Link>
  )
}

function CompactNavigationLink({
  item,
  navigationState,
  onNavigate,
}: {
  item: NavigationItemType
  navigationState: NavigationState
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const selected = navigationState === "selected"
  const link = (
    <Link
      href={item.href}
      aria-current={selected ? "page" : undefined}
      aria-label={item.label}
      data-navigation-state={navigationState}
      data-navigation-level="primary"
      onClick={onNavigate}
      className={compactLinkClassName(navigationState)}
    >
      {Icon ? <Icon aria-hidden="true" className="size-5" /> : null}
    </Link>
  )

  return (
    <li
      data-navigation-separator={item.separatorAfter ? "after" : undefined}
      className={cn(
        "flex justify-center",
        item.separatorAfter && "mb-3 border-b border-sidebar-border pb-3"
      )}
    >
      <Tooltip>
        <TooltipTrigger render={link} />
        <TooltipContent>{item.label}</TooltipContent>
      </Tooltip>
    </li>
  )
}

function CompactNavigationGroup({
  item,
  activeId,
  navigationState,
  onNavigate,
}: {
  item: NavigationItemType
  activeId: string | null
  navigationState: NavigationState
  onNavigate?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ left: 0, top: 0 })
  const triggerRef = React.useRef<HTMLAnchorElement | null>(null)
  const Icon = item.icon
  const selected = navigationState === "selected"

  const openFlyout = React.useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      setPosition({ left: rect.right + 8, top: rect.top })
    }
    setOpen(true)
  }, [])

  const closeFlyout = React.useCallback(() => setOpen(false), [])

  React.useEffect(() => {
    if (!open) return
    const closeOnViewportChange = () => setOpen(false)
    window.addEventListener("resize", closeOnViewportChange)
    window.addEventListener("scroll", closeOnViewportChange, true)
    return () => {
      window.removeEventListener("resize", closeOnViewportChange)
      window.removeEventListener("scroll", closeOnViewportChange, true)
    }
  }, [open])

  return (
    <li
      className="flex justify-center"
      onMouseEnter={openFlyout}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) closeFlyout()
      }}
      onFocusCapture={openFlyout}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeFlyout()
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return
        event.preventDefault()
        event.stopPropagation()
        triggerRef.current?.focus()
        closeFlyout()
      }}
    >
      <Link
        ref={triggerRef}
        href={item.href}
        aria-current={selected ? "page" : undefined}
        aria-label={item.label}
        aria-haspopup="true"
        aria-expanded={open}
        data-navigation-state={navigationState}
        data-navigation-level="primary"
        onClick={() => {
          closeFlyout()
          onNavigate?.()
        }}
        className={compactLinkClassName(navigationState)}
      >
        {Icon ? <Icon aria-hidden="true" className="size-5" /> : null}
      </Link>
      <div
        data-slot="operations-flyout"
        hidden={!open}
        className="fixed z-60 w-56 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-lg"
        style={{ left: position.left, top: position.top }}
      >
        <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {item.label}
        </p>
        <ul className="space-y-1">
          {item.children?.map((child) => {
            const childSelected = child.id === activeId
            return (
              <li key={child.id}>
                <Link
                  href={child.href}
                  aria-current={childSelected ? "page" : undefined}
                  data-navigation-state={
                    childSelected ? "selected" : "inactive"
                  }
                  onClick={() => {
                    closeFlyout()
                    onNavigate?.()
                  }}
                  className={cn(
                    "flex min-h-11 items-center rounded-md border-l-2 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    childSelected
                      ? "border-primary bg-muted font-semibold text-foreground"
                      : "border-transparent text-foreground/80 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {child.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

function compactLinkClassName(navigationState: NavigationState) {
  return cn(
    "flex size-11 items-center justify-center rounded-md border-l-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
    navigationState === "selected" &&
      "border-sidebar-primary bg-sidebar-accent text-sidebar-primary",
    navigationState === "section-active" &&
      "border-transparent bg-sidebar-accent/45 text-sidebar-primary hover:bg-sidebar-accent",
    navigationState === "inactive" &&
      "border-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
  )
}
