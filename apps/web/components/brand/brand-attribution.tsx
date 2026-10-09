import Image from "next/image"

export function BrandAttribution() {
  return (
    <a
      href="https://brocosolutions.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Powered by Broco Solutions, enlace externo"
      className="inline-flex min-h-11 items-center gap-2 rounded-md bg-background px-2 py-1 text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span>Powered by Broco Solutions</span>
      <Image
        src="/brand/BROCO_SOLUTIONS_logo_navy_transparent.png"
        alt=""
        width={67}
        height={72}
        className="h-auto w-[67px] shrink-0 object-contain"
      />
    </a>
  )
}
