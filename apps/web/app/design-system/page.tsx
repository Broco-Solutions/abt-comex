import Image from "next/image"
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileWarning,
  Info,
  PackageOpen,
  Plus,
  Search,
  Truck,
  XCircle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

const operations = [
  {
    reference: "IM-2026-0842",
    type: "Importación",
    client: "Industrias Delta",
    supplier: "Ningbo Atlas Co.",
    status: "En curso",
    eta: "14 oct 2026",
    amount: "USD 84.250",
  },
  {
    reference: "EX-2026-0317",
    type: "Exportación",
    client: "Frigorífico del Sur",
    supplier: "—",
    status: "Pendiente",
    eta: "18 oct 2026",
    amount: "USD 42.800",
  },
  {
    reference: "IM-2026-0835",
    type: "Importación",
    client: "Tecnoenvases SA",
    supplier: "Guangzhou Flex",
    status: "Requiere atención",
    eta: "09 oct 2026",
    amount: "USD 16.920",
  },
  {
    reference: "EX-2026-0312",
    type: "Exportación",
    client: "Molinos Andinos",
    supplier: "—",
    status: "Completado",
    eta: "02 oct 2026",
    amount: "USD 128.600",
  },
]

function Section({
  title,
  description,
  children,
}: Readonly<{
  title: string
  description: string
  children: React.ReactNode
}>) {
  return (
    <section
      aria-labelledby={title.toLowerCase().replaceAll(" ", "-")}
      className="border-t border-border py-8 sm:py-10"
    >
      <div className="mb-5 max-w-2xl">
        <h2
          id={title.toLowerCase().replaceAll(" ", "-")}
          className="text-lg font-semibold tracking-tight"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const config = {
    "En curso": { variant: "info" as const, icon: Clock3 },
    Pendiente: { variant: "warning" as const, icon: CircleAlert },
    Completado: { variant: "success" as const, icon: CheckCircle2 },
    "Requiere atención": { variant: "destructive" as const, icon: AlertCircle },
    Cancelado: { variant: "secondary" as const, icon: XCircle },
  }[status] ?? { variant: "secondary" as const, icon: Clock3 }
  const Icon = config.icon

  return (
    <Badge variant={config.variant}>
      <Icon aria-hidden="true" />
      {status}
    </Badge>
  )
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              ABT Comex · Interno
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Design System ABT v1
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Referencia visual de fundamentos para interfaces de gestión de
              comercio exterior.
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
        </header>

        <Section
          title="Branding"
          description="Paleta semántica para información operativa y estados del sistema."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Primary brand",
                "bg-primary text-primary-foreground",
                "Acción principal y navegación activa",
              ],
              [
                "Neutral",
                "bg-secondary text-secondary-foreground",
                "Superficies auxiliares y contexto",
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
            ].map(([name, color, use]) => (
              <div
                key={name}
                className="flex min-h-24 overflow-hidden rounded-lg border border-border"
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
            <div className="flex min-h-24 overflow-hidden rounded-lg border border-border">
              <div
                className="w-12 shrink-0 border-r border-border bg-background"
                aria-hidden="true"
              />
              <div className="p-3">
                <p className="text-sm font-medium">Blanco</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Superficie base
                </p>
              </div>
            </div>
            <div className="flex min-h-24 overflow-hidden rounded-lg border border-border">
              <div className="w-12 shrink-0 bg-foreground" aria-hidden="true" />
              <div className="p-3">
                <p className="text-sm font-medium">Texto principal</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Contenido operativo
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Tipografía"
          description="Inter prioriza legibilidad y densidad útil en tareas de operación diaria."
        >
          <div className="grid gap-6 lg:grid-cols-2">
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
                  Texto de cuerpo · 14 px
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Última actualización: hoy, 10:42 h
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Texto secundario · 14 px
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Los campos marcados con * son obligatorios.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Caption · 12 px
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
                Ref. IM-2026-0842 · 14 OCT 2026
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Botones"
          description="Las acciones principales se reservan para avanzar tareas; las destructivas requieren contexto claro."
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
        </Section>

        <Section
          title="Formularios"
          description="Etiquetas visibles, ayuda contextual y validaciones asociadas al campo."
        >
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
              <Label htmlFor="eta">ETA estimada</Label>
              <div className="relative">
                <CalendarDays
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground"
                />
                <Input id="eta" type="date" className="pl-9" />
              </div>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="customs-office">
                Aduana de ingreso
                <span className="text-muted-foreground">(solo lectura)</span>
              </Label>
              <Input id="customs-office" readOnly defaultValue="Buenos Aires" />
              <p className="text-xs text-muted-foreground">
                Dato informado por la operación.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Estados"
          description="Cada estado combina texto, icono y color para una lectura rápida y accesible."
        >
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="En curso" />
            <StatusBadge status="Pendiente" />
            <StatusBadge status="Completado" />
            <StatusBadge status="Requiere atención" />
            <StatusBadge status="Cancelado" />
          </div>
        </Section>

        <Section
          title="Feedback"
          description="Mensajes directos que indican qué ocurrió y cuál es el próximo paso."
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
                Verificá el número de permiso y volvé a intentarlo. Si el
                problema continúa, contactá a Operaciones.
              </AlertDescription>
            </Alert>
          </div>
        </Section>

        <Section
          title="Tabla empresarial"
          description="Listado compacto para seguimiento diario de operaciones de comercio exterior."
        >
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Referencia</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.map((operation) => (
                  <TableRow key={operation.reference}>
                    <TableCell className="font-mono text-xs font-medium">
                      {operation.reference}
                    </TableCell>
                    <TableCell>{operation.type}</TableCell>
                    <TableCell>{operation.client}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {operation.supplier}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={operation.status} />
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {operation.eta}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {operation.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>

        <Section
          title="Estados de interfaz"
          description="Representaciones claras para ausencia de datos, carga y fallas recuperables."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="flex min-h-52 flex-col items-center justify-center border border-dashed border-border p-6 text-center">
              <PackageOpen
                aria-hidden="true"
                className="size-7 text-muted-foreground"
              />
              <h3 className="mt-3 text-sm font-medium">
                No hay operaciones asignadas
              </h3>
              <p className="mt-1 max-w-56 text-xs leading-5 text-muted-foreground">
                Cuando se asignen operaciones a este equipo, aparecerán aquí.
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                <Plus aria-hidden="true" />
                Crear operación
              </Button>
            </div>
            <div
              className="min-h-52 border border-border p-5"
              aria-label="Cargando operaciones"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Truck
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                Cargando operaciones
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
                <div className="h-3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                <Separator className="my-4" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Obteniendo el último estado disponible.
              </p>
            </div>
            <div className="flex min-h-52 flex-col items-start justify-center border border-border p-6">
              <AlertCircle
                aria-hidden="true"
                className="size-6 text-destructive"
              />
              <h3 className="mt-3 text-sm font-medium">
                No se pudieron cargar las operaciones
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                La consulta venció antes de recibir una respuesta. Revisá tu
                conexión e intentá nuevamente.
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Reintentar
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </main>
  )
}
