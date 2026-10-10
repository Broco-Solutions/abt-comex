import Link from "next/link"
import { Ban, CircleAlert, FileQuestion, Info, LockKeyhole } from "lucide-react"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

const icons = {
  error: CircleAlert,
  "not-found": FileQuestion,
  "access-denied": LockKeyhole,
  "read-only": Ban,
  unavailable: Info,
} as const

export function ApplicationState({
  kind,
  title,
  description,
  preserved,
  action,
  className,
}: {
  kind: keyof typeof icons
  title: string
  description: string
  preserved?: string
  action?: React.ReactNode
  className?: string
}) {
  const Icon = icons[kind]
  return (
    <section
      aria-labelledby="application-state-title"
      className={cn(
        "max-w-2xl border-l-2 border-primary bg-background px-5 py-6 shadow-sm",
        kind === "error" && "border-destructive",
        className
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-6 text-primary",
          kind === "error" && "text-destructive"
        )}
      />
      <h1 id="application-state-title" className="mt-3 text-xl font-semibold">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {preserved ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {preserved}
        </p>
      ) : null}
      {action ? (
        <div className="mt-5 flex flex-wrap gap-2">{action}</div>
      ) : null}
    </section>
  )
}

export function AccessDeniedState() {
  return (
    <ApplicationState
      kind="access-denied"
      title="No tenés acceso a este contenido"
      description="La sección permanece protegida y no se muestran datos. Cuando el proceso de permisos esté definido, esta vista indicará a quién solicitar acceso."
      action={
        <Link href="/inicio" className={buttonVariants()}>
          Volver a Inicio
        </Link>
      }
    />
  )
}

export function ReadOnlyState() {
  return (
    <ApplicationState
      kind="read-only"
      title="Contenido disponible sólo para consulta"
      description="Podés revisar la información, pero las acciones de edición no están habilitadas en este contexto."
    />
  )
}

export function ContentUnavailableState() {
  return (
    <ApplicationState
      kind="unavailable"
      title="Contenido todavía no disponible"
      description="La estructura del módulo está preparada. Su contenido se incorporará en la etapa funcional correspondiente."
    />
  )
}
