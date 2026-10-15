import Image from "next/image"
import {
  AlertCircle,
  CheckCircle2,
  CircleAlert,
  FileWarning,
  Info,
  LoaderCircle,
  PackageOpen,
  Plus,
  Search,
} from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
} from "@workspace/ui/components/dialog"
import { formatDate, formatDateTime } from "@workspace/ui/lib/date"

import { OperationsWorkspace } from "./data/operations-workspace"
import { ComboboxReference } from "./data/combobox-reference"
import { DateFieldReference } from "./data/date-field-reference"
import { NavigationPatternReference } from "@/components/app-shell/navigation-pattern-reference"

const navigation = [
  ["Fundamentos", "fundamentos"],
  ["Navegación", "navegacion-shell"],
  ["Componentes", "componentes"],
  ["Formularios", "formularios"],
  ["Feedback", "feedback"],
  ["Filtros y datos", "tablas-datos"],
  ["Gráficos", "graficos"],
  ["Responsive", "responsive"],
] as const

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-4 border-t border-border py-8 sm:py-10"
    >
      <div className="mb-5 max-w-2xl">
        <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  )
}

function StatusBadge({
  status,
}: {
  status: "En curso" | "Pendiente" | "Completado" | "Requiere atención"
}) {
  const variants = {
    "En curso": "info",
    Pendiente: "warning",
    Completado: "success",
    "Requiere atención": "destructive",
  } as const
  return <Badge variant={variants[status]}>{status}</Badge>
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="border-b border-border pb-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-primary uppercase">
                ABT Comex · Referencia interna
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Design System ABT
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Fundamentos y patrones operativos para el producto de comercio
                exterior. Esta es la única referencia visual del frontend.
              </p>
            </div>
            <Image
              src="/brand/ABT_COMEX_logo_green_transparent.png"
              alt="ABT Comex"
              width={1983}
              height={793}
              priority
              className="h-auto w-32 shrink-0 object-contain sm:w-36"
            />
          </div>
          <nav
            aria-label="Secciones del design system"
            className="mt-6 flex gap-x-5 gap-y-2 overflow-x-auto border-t border-border pt-3 text-sm whitespace-nowrap"
          >
            {navigation.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-2 focus-visible:outline-primary"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <Section
          id="fundamentos"
          title="Fundamentos y branding"
          description="Identidad sobria, legible y orientada a tareas. El verde ABT identifica acciones y foco; los estados usan color, texto y contexto."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Primary",
                "bg-primary text-primary-foreground",
                "Acción principal y navegación activa",
              ],
              [
                "Success",
                "bg-success text-success-foreground",
                "Proceso confirmado o completado",
              ],
              [
                "Warning",
                "bg-warning text-warning-foreground",
                "Revisión o acción pendiente",
              ],
              [
                "Info",
                "bg-info text-info-foreground",
                "Información de seguimiento",
              ],
              [
                "Destructive",
                "bg-destructive text-white",
                "Bloqueo, error o acción irreversible",
              ],
              [
                "Neutral",
                "bg-secondary text-secondary-foreground",
                "Superficies auxiliares y contexto",
              ],
            ].map(([name, color, use]) => (
              <div
                key={name}
                className="flex min-h-22 overflow-hidden border border-border"
              >
                <div className={`w-12 shrink-0 ${color}`} aria-hidden="true" />
                <div className="p-3">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {use}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  Título de página
                </p>
                <p className="text-xs text-muted-foreground">
                  24–30 px · semibold
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">
                  Título de sección
                </p>
                <p className="text-xs text-muted-foreground">
                  18 px · semibold
                </p>
              </div>
              <div>
                <p className="text-sm leading-6">
                  El despacho se encuentra en revisión documental antes de su
                  arribo previsto.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Texto operativo · 14 px
                </p>
              </div>
            </div>
            <div className="border-l border-border pl-5 sm:pl-6">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Dato operativo
              </p>
              <p className="mt-2 font-mono text-2xl font-medium tabular-nums">
                USD 128.600,00
              </p>
              <p className="mt-1 font-mono text-sm text-muted-foreground tabular-nums">
                Ref. IM-2026-0842 · {formatDate("2026-10-14")}
              </p>
              <p className="mt-5 text-xs text-muted-foreground">
                Fecha: {formatDate("2026-10-14")} · Fecha y hora:{" "}
                {formatDateTime("2026-10-14T10:42:00")}
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="navegacion-shell"
          title="Application Shell / Navigation"
          description="La misma fuente de navegación alimenta sidebar expandida, rail compacto y drawer. Foco, tooltips y flyout mantienen disponibles todos los destinos."
        >
          <NavigationPatternReference />
        </Section>

        <Section
          id="componentes"
          title="Botones y componentes"
          description="Las acciones priorizan el flujo de trabajo. Los badges se reservan para estados, no para cualquier dato."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Crear operación</Button>
            <Button variant="secondary">Guardar borrador</Button>
            <Button variant="outline">Exportar</Button>
            <Button variant="ghost">Cancelar</Button>
            <Button variant="destructive">Anular operación</Button>
            <Button disabled>Procesar</Button>
            <Button>
              <Plus aria-hidden="true" />
              Nueva operación
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Buscar operaciones"
            >
              <Search aria-hidden="true" />
            </Button>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="En curso" />
            <StatusBadge status="Pendiente" />
            <StatusBadge status="Completado" />
            <StatusBadge status="Requiere atención" />
          </div>
          <div className="mt-6 border-t border-border pt-6">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Abrir diálogo de referencia
              </DialogTrigger>
              <DialogPortal>
                <DialogBackdrop />
                <DialogViewport>
                  <DialogPopup>
                    <DialogTitle>Confirmar contexto</DialogTitle>
                    <DialogDescription className="mt-2">
                      Los overlays administran foco, Escape, backdrop y retorno
                      al disparador de forma consistente.
                    </DialogDescription>
                    <div className="mt-5 flex justify-end">
                      <DialogClose render={<Button variant="outline" />}>
                        Cerrar
                      </DialogClose>
                    </div>
                  </DialogPopup>
                </DialogViewport>
              </DialogPortal>
            </Dialog>
          </div>
        </Section>

        <Section
          id="formularios"
          title="Formularios y validación"
          description="Labels visibles, ayuda contextual y errores que explican el problema y el siguiente paso."
        >
          <div className="mb-5"><ComboboxReference /></div>
          <div className="mb-5"><DateFieldReference /></div>
          <div className="grid max-w-4xl gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reference">Referencia interna</Label>
              <Input id="reference" placeholder="Ej.: IM-2026-0842" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">
                Cliente{" "}
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
                <span className="sr-only">(obligatorio)</span>
              </Label>
              <Input id="client" required placeholder="Razón social" />
              <p className="text-xs text-muted-foreground">
                Identificá al titular de la operación.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">
                Importe FOB (USD){" "}
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
                <span className="sr-only">(obligatorio)</span>
              </Label>
              <Input
                id="amount"
                aria-invalid="true"
                aria-describedby="amount-error"
                defaultValue="-1250"
              />
              <p id="amount-error" className="text-xs text-destructive">
                Ingresá un importe mayor a cero para continuar.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor</Label>
              <Input
                id="supplier"
                disabled
                defaultValue="Se habilita al seleccionar tipo importación"
              />
              <p className="text-xs text-muted-foreground">
                El estado deshabilitado comunica una dependencia, no un error.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="feedback"
          title="Feedback y estados"
          description="Cada estado informa qué ocurrió y permite recuperar o continuar con seguridad."
        >
          <div className="grid gap-3 lg:grid-cols-2">
            <Alert variant="info">
              <Info aria-hidden="true" />
              <AlertTitle>Documentación disponible</AlertTitle>
              <AlertDescription>
                La factura comercial ya está lista para revisión.
              </AlertDescription>
            </Alert>
            <Alert variant="warning">
              <CircleAlert aria-hidden="true" />
              <AlertTitle>Vencimiento próximo</AlertTitle>
              <AlertDescription>
                El certificado de origen vence en 3 días. Solicitá una
                renovación antes del despacho.
              </AlertDescription>
            </Alert>
            <Alert variant="success">
              <CheckCircle2 aria-hidden="true" />
              <AlertTitle>Operación actualizada</AlertTitle>
              <AlertDescription>
                Los cambios en la referencia IM-2026-0842 fueron guardados.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <FileWarning aria-hidden="true" />
              <AlertTitle>No se pudo registrar el despacho</AlertTitle>
              <AlertDescription>
                Verificá el número de permiso y volvé a intentarlo. Si continúa,
                contactá a Operaciones.
              </AlertDescription>
            </Alert>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="flex min-h-44 flex-col items-center justify-center border border-dashed border-border p-5 text-center">
              <PackageOpen
                aria-hidden="true"
                className="size-6 text-muted-foreground"
              />
              <h3 className="mt-2 text-sm font-medium">
                Sin operaciones asignadas
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Aparecerán cuando se asignen al equipo.
              </p>
            </div>
            <div
              className="min-h-44 border border-border p-5"
              aria-live="polite"
            >
              <p className="flex items-center gap-2 text-sm font-medium">
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
                Cargando operaciones
              </p>
              <div className="mt-5 space-y-3">
                <div className="h-3 w-2/5 animate-pulse bg-muted" />
                <div className="h-3 animate-pulse bg-muted" />
                <div className="h-3 w-4/5 animate-pulse bg-muted" />
              </div>
            </div>
            <div className="flex min-h-44 flex-col items-start justify-center border border-border p-5">
              <AlertCircle
                aria-hidden="true"
                className="size-6 text-destructive"
              />
              <h3 className="mt-2 text-sm font-medium">
                No se pudo actualizar
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Revisá la conexión e intentá nuevamente.
              </p>
              <Button size="sm" variant="outline" className="mt-3">
                Reintentar
              </Button>
            </div>
          </div>
        </Section>

        <OperationsWorkspace />

        <Section
          id="responsive"
          title="Responsive"
          description="La información se adapta a la tarea y al ancho, en vez de delegar legibilidad al scroll horizontal."
        >
          <div className="grid divide-y divide-border border-y border-border text-sm sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            <div className="p-4">
              <p className="font-medium">Desktop</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Campos prioritarios y selector de columnas.
              </p>
            </div>
            <div className="p-4">
              <p className="font-medium">Notebook</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Oculta automáticamente datos secundarios.
              </p>
            </div>
            <div className="p-4">
              <p className="font-medium">Tablet</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Conserva referencia, cliente, estado y valor.
              </p>
            </div>
            <div className="p-4">
              <p className="font-medium">Mobile</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Registro compacto expandible; sin tabla ancha.
              </p>
            </div>
          </div>
        </Section>
      </div>
    </main>
  )
}
