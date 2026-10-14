# Etapa 10 — Administración y Finanzas

> Estado: Under review
>
> Etapa: 10 — Administración y Finanzas
>
> Experiencias / recorridos: ADM-01 a ADM-03; J3, J4, J7 y J10
>
> Rutas: `/administracion`, `/administracion/[operationId]`, `/administracion/finanzas`

## Propósito y trazabilidad

Dar continuidad al pase operativo-administrativo sin reemplazar la contabilidad de Alpha2000 ni inferir reglas financieras. Cubre `FIN-001` a `FIN-009`, `ALP-005` a `ALP-008`, `EXP-006/007`, `IMP-006`, `WRK-003`, experiencias `ADM-01/02/03` y el recorrido J7; J10 aplica a fuente, actualidad y errores. La matriz conserva evidencia y pendientes de negocio.

## Rutas y alcance implementado

- `/administracion`: cola con búsqueda y filtro en URL para elementos sintéticos listos para facturar, facturados o pendientes. Incluye una tarea administrativa sin operación.
- `/administracion/[operationId]`: contexto por operación, dimensiones separadas, fuente, límites y navegación a ficha común/Exportación.
- `/administracion/finanzas`: dependencias y fuentes; el vínculo a la tarea sintética de rendición sin operación conserva su contexto.

La cola comparte el fixture de ciclo operativo con Exportación. Sólo hay referencias sintéticas; no se emiten facturas, no se registran cobros ni diferencias, no se cargan comprobantes y no se conecta Alpha2000. El botón para registrar referencia externa queda deshabilitado y explica la dependencia. Finanzas no presenta saldos, importes ni indicadores sin definiciones y permisos aprobados.

## Fuentes, privacidad y estados

Alpha2000 permanece fuente prevista para contabilidad, facturación, cobranzas, cuentas corrientes, gastos y otros datos administrativos; en esta versión está no conectada. Interbanking se mantiene en evaluación de lectura, sin pagos, transferencias, ECheqs, escritura ni conciliación automática. Microsoft 365 conserva alcance pendiente. Las integraciones y disponibilidades no se deducen de pantallas mock.

La vista no expone honorarios, condiciones comerciales, costos internos, saldos, márgenes ni totales monetarios. Ser responsable de la operación o jefe de área no concede acceso comercial. Los valores aduaneros pertenecen a su contexto operativo y no habilitan acceso económico. La matriz definitiva de capacidades sigue pendiente; los límites mock no constituyen seguridad productiva.

Facturación, cobranza, cumplido, post-embarque y cierre documental son dimensiones independientes. Una operación facturada puede continuar activa. Estado mostrado: fixture local; fuente externa y última actualización: no disponibles. Vistas sin permiso y error de lectura no exponen conteos ni confirman existencia.

## Criterios de aceptación y pruebas

- Buscar y filtrar cola; abrir objeto conservando URL de retorno y volver a Exportación cuando corresponda.
- Encontrar la tarea sintética de rendición sin crear operación artificial y abrir su contexto financiero sin importes.
- Consultar los estados por separado: `OP-DEM-3107` facturada sin referencia de cobranza; `OP-DEM-3112` lista para facturar; el ciclo operativo no se cierra por facturación.
- En ausencia de referencias administrativas no crear una fila ni inferir factura/cobranza.
- Errores y falta de permiso no filtran conteos o datos; verificar ausencia de importes y valores comerciales en la cola, detalle y fuentes.
- Tabla usable con teclado y viewport estrecho; en mobile permite desplazamiento horizontal con caption y encabezados asociados.
- Ninguna acción afirma escritura contable, pago o integración real.

Tests de datos y comportamiento: `features/administration/data/administration.test.ts`; accesibilidad y E2E de rutas en el gate del PR. Revisión visual humana integral pendiente.

## Pendientes de ABT / dependencia externa

Aceptación/devolución del handoff, condición de “lista para facturar”, evidencias y faltantes bloqueantes; campos, autoridad y direccionalidad de Alpha2000; categorías, moneda, comprobantes y permisos de gastos/rendiciones; disponibilidad de cobranzas/cuentas; fuentes, fórmulas y permisos de Dirección; integración y frecuencia; roles/capacidades efectivas. No se atribuye validación formal de ABT.

## UX-02 — bandeja responsive

Tabla en desktop amplio y lista compacta en tablet/móvil con referencia, contexto, facturación, cobranza y apertura visible. Conserva tarea sin operación y dimensiones separadas. No exige desplazar horizontalmente para abrir. Sin nuevos estados contables ni valores.
