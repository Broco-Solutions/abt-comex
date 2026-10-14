# Operaciones — listado

> Estado: Under review
>
> Etapa: 3 — Listado de Operaciones
>
> Última actualización: 14/10/2026
>
> Owner funcional: pendiente de validación con ABT
>
> Experiencias / recorridos: OPS-01, OPS-02; J1, J2, J3, J6
>
> Ruta: `/operaciones` y vistas filtradas aprobadas por tipo

## Propósito y alcance

Cuando una persona trabaja con operaciones, necesita encontrar el registro correcto, entender su situación de referencia, identificar el equipo asociado y abrir un contexto útil conservando los filtros. Este corte implementa el listado; la ficha común es Etapa 4 y no se presenta como disponible.

Incluye búsqueda, filtros combinables por tipo, situación, responsable y fecha de actualización; orden por columnas; agrupación; selección local sin acciones masivas; configuración local de columnas; paginación; vistas compactas para mobile; contexto temporal local.

## Evidencia y trazabilidad

| Necesidad de matriz | Fuente | Capacidad / proceso | Regla o límite | Experiencia / recorrido | Escenarios |
|---|---|---|---|---|---|
| OPE-002 | Matriz, sección Operaciones; alcance funcional §4 | Encontrar/filtrar operaciones por tipo, estado, cliente, responsable, fechas, modalidad y alertas | Filtros y orden en URL; no totales económicos genéricos; filtros disponibles en este prototipo no implican catálogo aprobado | OPS-01, OPS-02; J1–J3, J6 | S03-01 a S03-05 |
| OPE-003 | Matriz, detalle común | Abrir una operación desde una lista | Sólo contexto sintético hasta Etapa 4; ninguna ruta rota ni apariencia de ficha completa | OPS-01; J1 | S03-03 |
| COV-006, COV-008 | Alcance §7.2 y matriz transversal | Capacidades, procedencia y actualidad | Errores y sin permiso no publican filas/conteos; fixture local no es sincronización | OPS-01, OPS-02; J10 | S03-04, S03-05 |

La terminología de situación y el dataset son propuestas de demostración; no se han validado como catálogo formal de ABT. No hay importes, honorarios, márgenes, clientes reales, CUIT ni identificadores aduaneros reales.

## Información y acciones

- Identificación interna ficticia, tipo, cliente ficticio, situación sintética, equipo responsable, fecha de actualización, modalidad, alerta y próximo paso de referencia.
- Buscar por referencia, cliente, responsable o próximo paso; filtrar con tipo, situación, equipo y rango inclusivo de fechas de actualización.
- Ordenar referencia, cliente, tipo, situación, equipo o fecha desde cabeceras. El ciclo de orden conserva filtros en URL.
- Agrupar por tipo, situación o equipo, seleccionar filas sólo para seguimiento local y ocultar/mostrar columnas en la sesión. No se inicia acción masiva ni se guarda una vista entre sesiones.
- Enlazar desde Mi trabajo al contexto de una operación sintética si hay correspondencia; las tareas sin operación conservan su contexto de origen.

## Navegación y contexto

`/operaciones?tipo=importacion` y `?tipo=exportacion` filtran la lista. La búsqueda, filtros, orden, dirección, agrupación, página y objeto contextual se serializan en query string. Abrir una referencia muestra una vista contextual breve dentro del listado; cerrar vuelve a la misma selección de resultados. No se enlaza a `/operaciones/[id]` hasta implementar Etapa 4.

## Reglas, estados y recuperación

| Estado | Comportamiento | Recuperación |
|---|---|---|
| Cargado | Conteos limitados al fixture visible, rotulado como demostración | Filtrar, abrir contexto o paginar |
| Sin resultados | Explica filtros y permite limpiarlos | Reiniciar filtros |
| Error de lectura | No confirma total; conserva URL y ofrece reintento local | Reintentar lectura de demostración |
| Sin permiso | No representa filas ni conteos | Volver a Inicio |
| Objeto contextual inexistente | Conserva filtros sin revelar datos de otros contextos | Cerrar contexto o volver a la lista |

No hay integración externa conectada. Los estados de error y permiso son escenarios de interfaz, no diagnóstico de una fuente real ni autorización efectiva.

## Responsive y accesibilidad

Desktop y notebook usan el DataTable existente con metadatos explícitos y columnas configurables. En anchos menores se presentan registros compactos con tipo, cliente, situación, equipo, fecha, modalidad y alerta; no se requiere scroll horizontal de página. Los filtros se apilan progresivamente y la agrupación también identifica sus grupos en mobile. Orden se anuncia con `aria-sort` y nombre accesible del enlace; selección usa controles nativos y estado anunciado. Validar teclado, foco, contraste y viewports en revisión integral; axe automatizado no certifica WCAG.

## Fuente y fixtures

Feature `apps/web/features/operations`: tipos y dataset estables en `types/operation.ts` y `data/operations.ts`. Son datos totalmente sintéticos y locales. La UI indica que Alpha2000 no está conectada. Futuras fuentes deben sustituirse detrás de una frontera de lectura sencilla y aplicar autorización antes de entregar datos.

## Pruebas y aceptación

| Escenario | Resultado esperado | Implementación |
|---|---|---|
| S03-01 — búsqueda y filtros combinados | Resultados correctos y filtros serializados en URL | `data/operations.test.ts`, E2E Stage 3 |
| S03-02 — orden, grupo, columnas y selección | Conserva controles accesibles y no ofrece acción masiva ficticia | E2E/manual; detalles de estado local |
| S03-03 — abrir contexto y volver | Regresa con tipo/filtros preservados; sin ruta de detalle inexistente | E2E Stage 3 y enlace desde Mi trabajo |
| S03-04 — error recuperable | URL preservada, no se inventa total y reintento recupera vista | Componentes y E2E |
| S03-05 — sin permiso / no exposición económica | Sin filas ni conteos; listado no contiene valores económicos | Componentes, unitarias y E2E negativo |
| S03-06 — mobile y teclado | No overflow horizontal; controles disponibles y con foco visible | E2E de viewports + revisión manual pendiente |

## Decisiones pendientes

- Confirmar con ABT catálogo, definición de fechas de búsqueda, modalidades, alertas y criterios de agrupación.
- Definir matriz de capacidades y alcance de visibilidad; el estado mock no es seguridad.
- Acordar vistas guardadas, si se necesitan, y su persistencia futura.
- Implementar detalle común en Etapa 4 antes de sustituir el contexto temporal.

## Implementación y revisión

- Rutas: `/operaciones`, filtros aprobados por tipo.
- Código: `apps/web/features/operations/`; integración contextual en `apps/web/features/work/components/worklist.tsx`.
- Pruebas: `operations.test.ts`, `operations-list.test.tsx`, `operations-list.a11y.tsx`, `apps/web/e2e/specs/stage-03-operations.spec.ts` y regresión de `stage-02-work.spec.ts`.
- Estado: implementación local completa; CI/PR y revisión visual humana integral pendientes. No se afirma que etapa esté aprobada ni lista para uso operativo.
