"use client"

import * as React from "react"
import { CircleHelp } from "lucide-react"

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
import { ContextualHelp } from "./contextual-help"

export function HelpEntryPoint({
  label = "Ayuda",
  onNavigate,
}: {
  label?: string
  onNavigate?: () => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="sm" />}
        aria-label="Abrir ayuda"
      >
        <CircleHelp aria-hidden="true" />
        <span>{label}</span>
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport className="items-stretch justify-end p-0 sm:p-3">
          <DialogPopup className="h-dvh max-w-md overflow-y-auto rounded-none border-y-0 border-r-0 p-5 pt-16 sm:h-auto sm:max-h-[calc(100dvh-1.5rem)] sm:rounded-lg sm:border">
            <DialogTitle>Ayuda de ABT Comex</DialogTitle>
            <DialogDescription className="mt-2">
              Orientación breve sobre el módulo actual y los primeros pasos.
            </DialogDescription>
            <div className="mt-6">
              <ContextualHelp
                onNavigateToOnboarding={() => {
                  setOpen(false)
                  onNavigate?.()
                }}
              />
            </div>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
