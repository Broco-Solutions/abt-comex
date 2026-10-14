import Link from "next/link"

import { PageHeader } from "@/components/navigation/page-header"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { visibleWorkItems } from "@/features/work/data/work-items"

export function FinanceOverview({ workId }: { workId: string }) {
  const task = visibleWorkItems().find((item) => item.id === workId)
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuentes y finanzas"
        secondaryActions={
          <Link
            href="/administracion"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Volver a la cola
          </Link>
        }
      />
      {workId ? (
        <section className="border-y border-border py-4" aria-live="polite">
          <h2 className="font-medium">
            {task ? task.reference : "Tarea no disponible"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {task
              ? `${task.title} · ${task.reason}`
              : "No hay información autorizada para esta referencia."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sin operación vinculada y sin importes en el escenario sintético.
          </p>
        </section>
      ) : null}
      <section
        className="grid gap-5 md:grid-cols-2"
        aria-label="Fuentes externas"
      >
        <article className="space-y-2 border-y border-border py-4">
          <h2 className="font-semibold">Alpha2000 administrativo / contable</h2>
          <p className="text-sm text-muted-foreground">
            Fuente prevista para facturación, cobranzas, cuentas corrientes,
            compras, proveedores, pagos, retenciones, gastos y referencias para
            Dirección.
          </p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Estado</dt>
              <dd className="mt-1 font-medium">No conectado</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Operación</dt>
              <dd className="mt-1 font-medium">Lectura/escritura pendiente</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            Alpha2000 conserva la contabilidad. Campos, fuente por dato,
            contrato, permisos, frecuencia y condiciones comerciales deben
            relevarse.
          </p>
        </article>
        <article className="space-y-2 border-y border-border py-4">
          <h2 className="font-semibold">Interbanking</h2>
          <p className="text-sm text-muted-foreground">
            En evaluación para consultas autorizadas de lectura. Saldos y
            movimientos sólo si proveedor, alcance y necesidad son confirmados.
          </p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Estado</dt>
              <dd className="mt-1 font-medium">Pendiente de factibilidad</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Escritura bancaria
              </dt>
              <dd className="mt-1 font-medium">Fuera del alcance actual</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            No se habilitan pagos, transferencias, ECheqs ni conciliación
            automática.
          </p>
        </article>
        <article className="space-y-2 border-y border-border py-4">
          <h2 className="font-semibold">Microsoft 365</h2>
          <p className="text-sm text-muted-foreground">
            Plataforma prevista para correo y documentos relacionados con
            operaciones; permisos, referencias e historial por definir.
          </p>
          <p className="text-xs text-muted-foreground">
            No se representa automatización ni sincronización en esta
            demostración.
          </p>
        </article>
        <article className="space-y-2 border-y border-border py-4">
          <h2 className="font-semibold">Definiciones de negocio</h2>
          <p className="text-sm text-muted-foreground">
            Fórmulas, períodos, moneda, responsables, sensibilidad y fuentes de
            costos, impuestos y rentabilidad necesitan validación antes de
            exponer métricas.
          </p>
          <p className="text-xs text-muted-foreground">
            No se presentan importes, totales ni resultados económicos.
          </p>
        </article>
      </section>
      <p className="border-t border-border pt-4 text-xs text-muted-foreground">
        Fuentes sintéticas o no conectadas. Última actualización externa: no
        disponible. Una pantalla mock no valida contrato ni integración.
      </p>
    </div>
  )
}
