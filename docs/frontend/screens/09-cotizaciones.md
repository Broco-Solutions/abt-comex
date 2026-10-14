# Cotizaciones — lista, detalle, versiones y edición

> Estado: Under review
>
> Etapa: 9 — Cotizaciones
>
> Experiencias / recorridos: COT-01 a COT-04; J1 y J5
>
> Rutas: `/cotizaciones`, `/cotizaciones/nueva`, `/cotizaciones/[quoteId]`, `/cotizaciones/[quoteId]/editar`

## Propósito y alcance

Representar el circuito comercial previo y distinguir con claridad la aprobación
interna, el envío y la aceptación o rechazo del cliente. Esta pasada es una
demostración local con fixtures inventados; no registra un proceso comercial
real. Desde una versión aceptada, la continuidad abre el alta local de Etapa 5;
no crea una Operación hasta completar ese asistente.

## Trazabilidad y límites de decisión

| Necesidades | Comportamiento implementado                                                        | Pendiente de validación                                              |
| ----------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| COT-001     | Borrador con cliente, servicio descriptivo, contexto, moneda, líneas y condiciones | Campos obligatorios, catálogos, datos maestros y estados definitivos |
| COT-002     | Subtotal y total explícitos como cantidad × unitario, en moneda única por versión  | Impuestos, gastos, descuentos, conversión, decimales y redondeo      |
| COT-003     | Cada edición crea una nueva versión; el historial anterior no se sobrescribe       | Vigencia, comparación, políticas de edición y auditoría real         |
| COT-004     | La acción de envío local requiere aprobación interna simulada                      | Capacidades, niveles, delegación y evidencia de aprobación           |
| COT-005     | Envío simulado y respuesta simulada son eventos separados                          | Canales, evidencia, reenvío, respuesta parcial y vencimiento         |
| COT-006     | Se abre el alta guiada desde la versión aceptada y se conserva el origen           | Cardinalidad cotización→operación y reglas de transferencia          |

Fuentes: [Matriz de Cobertura COT-001–006](../MATRIZ_COBERTURA_FUNCIONAL.md#cotizaciones-y-aprobaciones),
[mapa COT-01–04](../MAPA_PANTALLAS_Y_RECORRIDOS.md#inventario-de-experiencias),
[alcance funcional](../../product/ALCANCE_FUNCIONAL.md). Las necesidades son
base documentada, no aprobación formal de campos o reglas por Dirección de ABT.

## Recorrido y estados

- La lista permite buscar referencia, cliente, servicio o responsable; filtra
  por cliente y por hitos disponibles, y mantiene el filtro en URL al abrir y volver.
- La ficha muestra versión vigente, moneda, fórmula visible, condiciones,
  fuente local, fecha ficticia e historial de eventos por versión.
- La edición genera una versión nueva con hitos pendientes, conservando las
  respuestas de la versión anterior.
- La secuencia demostrativa es aprobación interna → envío local → aceptación o
  rechazo simulado. No se puede saltar pasos y una respuesta no se duplica.
- Desde la versión vigente con aceptación simulada, abre Etapa 5 con el ID y
  número exacto; una versión no aceptada no ofrece el camino comercial.
  Completar Etapa 5 crea sólo un registro local y conserva vínculo/origen.
- El listado no confirma filas ni conteos ante `sin-permiso` o error de lectura.
  El detalle tampoco confirma existencia cuando el acceso está restringido.

## Datos, sensibilidad y procedencia

Los cuatro registros, identificadores, clientes, importes, condiciones, fechas y
eventos son sintéticos. Se relacionan por ID estable con los clientes ficticios
de Etapa 6. Los cambios se conservan sólo en `sessionStorage` de la pestaña;
hay fallback en memoria si el navegador deniega ese almacenamiento. Reiniciar
el escenario restablece los fixtures. No hay backend, persistencia, auditoría ni
autorización efectiva.

La capacidad comercial está simulada en la demostración. El responsable de una
operación o jefe de área no obtiene por eso permiso para ver honorarios. Los
estados restringidos ocultan filas, conteos y valores en este frontend, pero no
constituyen seguridad: la futura API deberá autorizar y filtrar antes de
entregar datos.

No se calculan impuestos, descuentos, gastos, tipo de cambio ni redondeos. No se
envían mensajes ni se registran aprobaciones o respuestas reales. Todos los
campos y catálogos propuestos siguen sujetos a validación de ABT.

## Responsive y accesibilidad

Filtros, líneas y registros se apilan en anchos reducidos. Los formularios usan
etiquetas explícitas, validación textual y foco visible; estados de error,
permiso y carga son semánticos. La prueba axe es apoyo, no certifica WCAG 2.2 AA.
La inspección visual automatizada/capturas y la revisión humana integral siguen
pendientes.

## Pruebas y aceptación técnica

- Unitarias: cálculo, secuencia de hitos, preservación de versión, filtros y
  rechazo de datos de sesión inválidos.
- Componentes: listados normal, filtrado, error y sin permiso; sin conteos ni
  valores ante permiso ausente.
- E2E: aprobación → envío → aceptación, alta de versión, contexto Cliente ↔
  Cotización, errores restringidos y ancho móvil.
- Gate: no confundir aprobación con aceptación; crear operación de referencia
  sólo desde versión aceptada; no introducir reglas financieras no definidas.

Validación local: TypeScript/build pasaron; 63 pruebas unitarias/componentes y
16 pruebas axe pasaron; los E2E de Cotizaciones y creación integrada pasan en Chromium, junto
con el smoke existente tras integración final. Se detectaron y corrigieron
durante E2E la habilitación prematura de conversión, el retorno Cliente ↔
Cotización y el overflow del filtro a 1024 px. No se afirma cobertura visual en
otros motores ni certificación WCAG. Capturas inspeccionadas manualmente en
Chromium: lista y detalle a 1440×1000; formulario a 390×844. El recorrido E2E
midió sin overflow a 390, 768, 900, 1024, 1280 y 1440 px.

## Implementación

- Feature: `apps/web/features/quotes/`.
- Rutas: `apps/web/app/(app)/cotizaciones/`.
- Integración con Cliente: enlace filtrado sin divulgar conteos o valores en la
  ficha maestra.
- Estado de etapa: Under review hasta revisión humana funcional y visual.

## UX-02 — colección comercial

DataTable en ancho suficiente y registros compactos en móvil/tablet. Referencia, cliente, versión, aprobación interna, envío, respuesta y actualización son dimensiones separadas; precio no ocupa la vista inicial. Sin selección masiva ni estados definitivos nuevos. Se preservan búsqueda, filtros y retorno. Prueba responsive y comparativa en ux-lists.spec.ts y suites de Cotizaciones.
