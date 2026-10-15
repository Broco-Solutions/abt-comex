"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
} from "@workspace/ui/components/dialog"
import { AppSidebar } from "./app-sidebar"

export function MobileNavigation({
  forceVisible = false,
}: {
  forceVisible?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const popupRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon-lg" />}
        aria-label="Abrir navegación principal"
        className={forceVisible ? undefined : "lg:hidden"}
      >
        <Menu aria-hidden="true" />
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport className="items-stretch justify-start p-0">
          <DialogPopup
            ref={popupRef}
            initialFocus={() => {
              return popupRef.current?.querySelector<HTMLElement>("nav a")
            }}
            closeLabel="Cerrar navegación"
            className="h-dvh max-h-none w-[min(22rem,calc(100vw-2rem))] max-w-none translate-x-0 overflow-hidden rounded-none border-y-0 border-l-0 p-0 data-ending-style:-translate-x-3 data-ending-style:scale-100 data-starting-style:-translate-x-3 data-starting-style:scale-100"
          >
            <DialogTitle className="sr-only">Navegación principal</DialogTitle>
            <DialogDescription className="sr-only">
              Elegí una sección de ABT Comex.
            </DialogDescription>
            <AppSidebar
              presentation="overlay"
              onNavigate={() => setOpen(false)}
            />
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
