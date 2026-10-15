# Etapa 10 — Administración y Finanzas

> Estado: Under review
>
> Etapa: 10 — Administración y Finanzas
>
> Experiencias / recorridos: ADM-01 a ADM-03; J3, J4, J7 y J10
>
> Rutas: `/administracion`, `/administracion/[operationId]`, `/administracion/finanzas`

## Propósito y trazabilidad

### Navegación vigente V3 — decisión interna del 15/10/2026

`/administracion` abre la Bandeja administrativa para ejecutar trabajo recibido,
revisiones y faltantes. Cuatro áreas comprensibles sustituyen siete pestañas al
mismo nivel: Bandeja administrativa; Gastos y rendiciones; Ingresos y egresos;
Comprobantes y cuentas. Sólo la sección activa expone subconsultas: Gastos,
Anticipos y rendiciones y análisis especializado G2/G3; o Comprobantes, Cuentas
por cobrar y Cuentas por pagar. En móvil un selector compacto de área conserva
espacio y acceso. Capacidad restringida elimina destinos no utilizables.

Rutas históricas de gastos/movimientos/rendiciones/comprobantes/carteras/finanzas
se conservan. Categorías/conceptos tienen entrada en `/configuracion/categorias`
y acceso desde Gastos; `/administracion/categorias` sigue funcionando para
enlaces anteriores. Dirección es la entrada de análisis ejecutivo transversal.
Las cuentas conservan fecha de corte, moneda original y distinción cobrar/pagar;
un gasto registrado no implica pago.

Dar continuidad al pase operativo-administrativo sin reemplazar la contabilidad de Alpha2000 ni inferir reglas financieras. Cubre `FIN-001` a `FIN-009`, `ALP-005` a `ALP-008`, `EXP-006/007`, `IMP-006`, `WRK-003`, experiencias `ADM-01/02/03` y el recorrido J7; J10 aplica a fuente, actualidad y errores. La matriz conserva evidencia y pendientes de negocio.

## Rutas y alcance implementado

- `/administracion`: cola con búsqueda y filtro en URL para elementos sintéticos listos para facturar, facturados o pendientes. Incluye una tarea administrativa sin operación.
- `/administracion/[operationId]`: contexto por operación, dimensiones separadas, fuente, límites y navegación a ficha común/Exportación.
- `/administracion/finanzas`: G2 gastos registrados por categoría y G3 cuentas por cobrar según saldos informados al corte; fuentes bajo demanda. El vínculo a la rendición sin operación conserva su contexto y no le asigna importes artificiales.

Corte V2 (ampliado por V3 más abajo): la cola comparte el fixture de ciclo operativo con Exportación. Sólo hay referencias sintéticas; no se emiten facturas, no se registran cobros ni diferencias, no se cargan comprobantes y no se conecta Alpha2000. El botón para registrar referencia externa queda deshabilitado y explica la dependencia. UX-05 incorpora importes sintéticos autorizados para evaluación frontend, no definiciones financieras productivas.

## Fuentes, privacidad y estados

Alpha2000 permanece fuente prevista para contabilidad, facturación, cobranzas, cuentas corrientes, gastos y otros datos administrativos; en esta versión está no conectada. Interbanking se mantiene en evaluación de lectura, sin pagos, transferencias, ECheqs, escritura ni conciliación automática. Microsoft 365 está excluido de V3 según el alcance vigente. Las integraciones y disponibilidades no se deducen de pantallas mock.

La cola y el detalle no exponen honorarios, condiciones comerciales, costos internos, márgenes ni totales monetarios genéricos. Finanzas muestra únicamente registros sintéticos y saldos informados a las perspectivas con capacidad financiera. Ser responsable de la operación o jefe de área no concede acceso comercial. Los valores aduaneros pertenecen a su contexto operativo y no habilitan acceso económico. La matriz definitiva de capacidades sigue pendiente; los límites mock no constituyen seguridad productiva.

Facturación, cobranza, cumplido, post-embarque y cierre documental son dimensiones independientes. Una operación facturada puede continuar activa. Estado mostrado: fixture local; fuente externa y última actualización: no disponibles. Vistas sin permiso y error de lectura no exponen conteos ni confirman existencia.

## Criterios de aceptación y pruebas

- Buscar y filtrar cola; abrir objeto conservando URL de retorno y volver a Exportación cuando corresponda.
- Encontrar la tarea sintética de rendición sin crear operación artificial y abrir su contexto financiero sin importes.
- Consultar los estados por separado: `OP-DEM-3107` facturada sin referencia de cobranza; `OP-DEM-3112` lista para facturar; el ciclo operativo no se cierra por facturación.
- En ausencia de referencias administrativas no crear una fila ni inferir factura/cobranza.
- Errores y falta de permiso no filtran conteos o datos; no aparecen importes comerciales en cola ni detalle. En Finanzas, gráfico y registros comparten los mismos filtros, moneda y datos.
- Apertura accesible en la bandeja compacta móvil, sin desplazamiento horizontal; gráficos con enlaces y valores accesibles, sin depender de hover.
- Ninguna acción afirma escritura contable, pago o integración real.

Tests de datos y comportamiento: `features/administration/data/administration.test.ts`; accesibilidad y E2E de rutas en el gate del PR. Revisión visual humana integral pendiente.

## Pendientes de ABT / dependencia externa

Aceptación/devolución del handoff, condición de “lista para facturar”, evidencias y faltantes bloqueantes; campos, autoridad y direccionalidad de Alpha2000; categorías, moneda, comprobantes y permisos de gastos/rendiciones; disponibilidad de cobranzas/cuentas; fuentes, fórmulas y permisos de Dirección; integración y frecuencia; roles/capacidades efectivas. No se atribuye validación formal de ABT.

## UX-02 — bandeja responsive

Tabla en desktop amplio y lista compacta en tablet/móvil con referencia, contexto, facturación, cobranza y apertura visible. Conserva tarea sin operación y dimensiones separadas. No exige desplazar horizontalmente para abrir. Sin nuevos estados contables ni valores.

## UX-05 — contrato analítico sintético

Autoridad de registros: features/finance/data/financial-records.ts, con clientes existentes y relaciones operativas sólo donde el ciclo ya contiene facturación/cobranza. No es la planilla real ni una sincronización. Corte fijo 14/10/2026. G1/G4 se presentan en Dirección; G2/G3 en Finanzas. G5 se especifica en Inicio.

| Gráfico | Datos / agregación | Interacción y alternativa accesible |
|---|---|---|
| G1 | Facturas por fecha de factura y cobros por fecha de cobro, agrupados por mes; monedas independientes | Selección de barra o enlace tabular por serie/mes |
| G2 | Gastos registrados por categoría sintética; no implica pago | Barra o enlace de categoría abre sus registros |
| G3 | Saldos explícitamente informados, positivos, de facturas del período a fecha de corte; vencido/hoy/posterior/sin fecha, sin calificación de riesgo | Selección de tramo abre facturas y saldo, no importe facturado; saldo ausente se declara y excluye |
| G4 | Mismas facturas de G1 por cliente, sin segundo dataset | Barra o enlace abre esos comprobantes |

Filtros URL: desde/hasta (fecha del evento), moneda y cliente; drill-down agrega serie/dimensión/grupo. Retorno conserva filtros. Gráficos Recharts y ChartContainer existentes, tooltip con unidad/moneda, valores/enlaces disponibles sin hover, estado vacío/error/sin permiso. No se suman monedas, no se calcula rentabilidad ni se interpreta facturación menos cobranzas como deuda. Pruebas: financial-records.test.ts y ux-analytics.spec.ts.

UX-06 añade accesos a facturas, cobros y gastos del período autorizado, derivados de los mismos registros/filtros analíticos; no exige acceso a Dirección para explorar registros administrativos. No hay emisión/pago ni asignación artificial de importes a la rendición sin operación.

UX-07 valida fechas calendario de la URL y rango Desde/Hasta: un valor imposible o invertido ofrece corrección y restablecimiento, conserva moneda/cliente, no renderiza gráficos ni confirma totales. No se convierten fechas inválidas en un período distinto silenciosamente. Se comparte el comportamiento con Dirección.

## V3-04 — Preparación administrativa local

Preparación técnica revisada 15/10/2026 sobre el alcance V3 aprobado internamente; no reglas contables/roles ABT definitivos. CAT-001 y MOV-001 amplían el corte anterior sin sustituir la contabilidad de Alpha2000. Personas/organizaciones son fuentes compartidas, no copias en cada formulario. Fuente actual: features/administration/data/administrative-ledger.ts; financial-records.ts conserva semillas inmutables, no el estado de gastos/cobros modificado.

### Rutas y recorridos

- /administracion/categorias: buscar, alta, edición, inactivación/reactivación confirmada. Uso Gasto/Ingreso/Egreso/Compartida es clasificación sintética, no catálogo contable validado. Cambiar nombre no elimina la denominación histórica del registro; un uso ya referenciado no se cambia silenciosamente. Sin subcategorías ni centros de costo especulativos.
- /administracion/gastos y /administracion/gastos/[expenseId]: concepto, fecha de registro, moneda/importe, categoría, proveedor ABT opcional, operaciones opcionales/múltiples, referencias de evidencia, notas y referencia externa por verificar. Gasto general sin operación ficticia. Alta contextual de categoría/proveedor conserva borrador y selecciona el nuevo registro. Tabla desktop amplia; lista compacta con apertura e importe visibles debajo. Búsqueda/filtros en URL sin recarga de documento.
- /administracion/movimientos y /administracion/movimientos/[movementId]: naturaleza explícita, ingreso/egreso, fecha propia, moneda/importe, categoría, contraparte administrativa, integrante para anticipos/devoluciones cuando corresponda, operaciones y evidencia. Cobro no es factura; pago no es gasto; anticipo no implica gasto justificado. No se ejecutan transferencias ni se contabiliza.
- /administracion/rendiciones y /administracion/rendiciones/[renditionId]: referencia, anticipo e importe aplicado, gastos relacionados, devolución e importe aplicado, evidencia y diferencia por revisar. Anticipo puede distribuirse entre preparaciones sin superar su importe; no conversión entre monedas. El escenario utiliza referencias completas de gasto, sin prorrateo documental validado. Estado preparado para revisión no equivale a aprobación o cierre externo.

J12 conecta proveedor/categoría → gasto general u operativo → registro/gráfico; anticipo → rendición → gasto/evidencia → tarea. La rendición de la tarea sin operación continúa sin operación; su preparación sintética tiene referencias propias, no importes inventados sobre la tarea original. Completar la referencia pendiente actualiza rendición y proyecciones de trabajo, no aprueba gastos.

### Reglas de presentación y sensibilidad

Preparación local, referencia del escenario, referencia externa por verificar y registro contable externo son conceptos distintos. Capturar una referencia no confirma vínculo/sincronización. Un vendedor/proveedor de mercadería del cliente no se convierte en proveedor de ABT ni genera deuda; gastos/movimientos sólo aceptan roles administrativos pertinentes del escenario. Ninguna escritura en Alpha2000.

Gastos requieren consulta de gastos y costos internos; ingresos/cobros consulta de cobranzas, egresos consulta de tesorería; preparación y catálogo se habilitan por capacidades explícitas. Rendición con importes de anticipos requiere también tesorería. Ser responsable operativo no habilita estas categorías. Columnas, opciones, gráficos y relaciones respetan capacidades; las restricciones mock no son seguridad real.

Registros y G2 comparten exactamente las mismas fuentes/filtros; sólo naturaleza Cobro alimenta su serie, no todos los ingresos. Importe conserva dos decimales, agregaciones aritméticas en centavos, monedas sin suma/conversión implícita. Facturas/saldos informados continúan el contrato V2 hasta V3-05: no se infiere cartera como facturación menos cobros.

### Aceptación y pendientes

Crear categoría/proveedor dentro de gasto preserva concepto e importe, permite seleccionar nuevos registros y los reutiliza en listas/fichas. Guardar produce feedback y enlace aunque filtros oculten la fila. Editar evidencia se refleja en rendición y tareas; sin aprobación externa. Gráfico → gasto/movimiento → contraparte/operación → retorno conserva el contexto permitido. Datos inexistentes/error/sin permiso no se sustituyen por importes cero.

Pruebas: administrative-ledger.test.ts (moneda, referencias, capacidad relacional, inactivos/historia, agregación y rendición); v3-administration.spec.ts (recorridos reales); administrative-ledger.a11y.tsx. Gates y revisión visual reales en el plan; no certificación WCAG automática.

Pendientes ABT/Alpha: catálogo/centros de costo, prorrateos, aprobación de gastos/rendiciones, obligaciones, aplicaciones/saldos informados y autoridad de escritura. Comprobantes/carteras se completan en V3-05; no afirmar cubiertos por esta preparación. Contratos externos no implementados.

## V3-05 — Comprobantes, aplicaciones y carteras

Ampliación frontend autorizada internamente, Under review. `/administracion/comprobantes` y `/administracion/comprobantes/[voucherId]` permiten preparar, editar y consultar referencia, tipo, contraparte, concepto, emisión, vencimiento, moneda, importe, múltiples operaciones y vínculo externo por verificar. Alta contextual de organización conserva borrador. Preparado no integra facturación ni cartera. La opción explícita «Referencia de evaluación» permite comprobar esos consumidores con registros sintéticos; no emite, contabiliza ni confirma recepción de Alpha2000.

`/administracion/carteras` separa Cobrar/Pagar y moneda. Corte inicial del escenario: 14/10/2026. Incluye todas las referencias abiertas emitidas hasta el corte, aunque su emisión sea anterior al período del análisis. No filtra silenciosamente por mes de factura. Saldo ausente se muestra como no disponible, con conteo separado; no se agrega como cero. Vencido es comparación temporal, no calificación de riesgo. Notas de crédito/fondos no aplicados no reducen obligaciones automáticamente.

Fuente compartida: `features/administration/data/vouchers.ts`. Semillas sintéticas explican los saldos conocidos mediante las mismas referencias de cobro/pago que se consultan en Movimientos; referencias complementarias son ejemplos nuevos, no datos externos inspeccionados. Falta de historial en una referencia impide afirmar saldo/aplicar fondos. Saldo informado original y saldo del escenario modificado son categorías visibles distintas.

Aplicación parcial admite varios comprobantes por movimiento y varias referencias por comprobante. Exige misma contraparte, moneda, cartera, fechas compatibles e importes disponibles en centavos; sin conversión ni sobreaplicación. Crédito es documento, pago/cobro es movimiento; no se equiparan. Las relaciones aplicadas protegen cambios incompatibles de importe/moneda/contraparte/tipo/fecha. No hay eliminación contable, transferencias, aprobación ni registración externa. Reversión contable de aplicaciones recibidas, impuestos/retenciones y política fiscal quedan pendientes de ABT/Alpha; no se inventan.

Consulta de ventas requiere facturación/cobranzas; saldo y aplicaciones requieren cobranzas. Compras/cartera pagar requieren tesorería. Preparar requiere además capacidad explícita. Contraparte extranjera del cliente no es proveedor contratado ABT: no crea obligación ni es elegible como proveedor administrativo sin ese rol.

Listas compactas adaptativas con identidad/apertura siempre visibles, búsqueda/moneda/cartera/corte principales y filtros secundarios plegables. URL local, Atrás/Adelante, paginación y retorno/foco sin documento completo. G1/G4 reutilizan facturas de referencia y G3 cambia respecto del corte V2: cartera completa al corte, no sólo facturas del período. Gráfico → comprobante → cobro/pago/crédito/contraparte/operación → retorno mantiene procedencia.

Aceptación: compra anterior abierta aparece al corte; antes del pago conserva importe pendiente anterior; aplicación parcial modifica sólo saldo del escenario, no saldo informado; documento preparado no aparece como factura emitida; moneda/contraparte incorrecta y exceso se rechazan; perspectiva operativa no ve datos financieros. Pruebas: `vouchers.test.ts`, `vouchers.a11y.tsx`, `v3-vouchers.spec.ts`; evidencia real y límites en el plan.
