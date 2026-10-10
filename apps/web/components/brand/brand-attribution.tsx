"use client"

import Image from "next/image"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

export function BrandAttribution({ compact = false }: { compact?: boolean }) {
  const attributionLink = (
    <a
      href="https://brocosolutions.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        compact
          ? "Powered by Broco Solutions"
          : "Powered by Broco Solutions, enlace externo"
      }
      data-brand-attribution={compact ? "compact" : "full"}
      className={
        compact
          ? "inline-flex size-11 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          : "inline-flex flex-col items-start rounded-md px-1 py-1 text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      }
    >
      {compact ? null : <span>Powered by</span>}
      <Image
        alt=""
        src={
          compact
            ? "/brand/BROCO_SOLUTIONS_isotype_gradient.svg"
            : "/brand/BROCO_SOLUTIONS_logo_gradient.svg"
        }
        width={compact ? 588 : 1810}
        height={705}
        unoptimized
        className={
          compact
            ? "h-6 w-auto shrink-0 object-contain"
            : "h-auto w-16 shrink-0 object-contain"
        }
      />
    </a>
  )

  if (!compact) return attributionLink

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={attributionLink} />
        <TooltipContent>Powered by Broco Solutions</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
