"use client"

import Image from "next/image"
import Link from "next/link"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

export function AbtBrand({ compact = false }: { compact?: boolean }) {
  const brandLink = (
    <Link
      href="/inicio"
      aria-label="ABT Comex — Ir a Inicio"
      data-brand-variant={compact ? "isotype" : "wordmark"}
      className={
        compact
          ? "inline-flex size-11 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
          : "inline-flex min-h-11 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
      }
    >
      <Image
        src={
          compact
            ? "/brand/ABT_COMEX_isotype_green_transparent.png"
            : "/brand/ABT_COMEX_logo_green_transparent.png"
        }
        alt=""
        width={compact ? 796 : 1983}
        height={compact ? 717 : 793}
        priority
        className={
          compact
            ? "h-auto w-10 object-contain brightness-0 invert"
            : "h-auto w-32 object-contain brightness-0 invert"
        }
      />
    </Link>
  )

  if (!compact) return brandLink

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={brandLink} />
        <TooltipContent>ABT Comex — Ir a Inicio</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
