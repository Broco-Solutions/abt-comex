# <Área> — <Vista o flujo>

> Estado: Draft
> Etapa: <número y nombre>
> Última actualización: <DD/MM/AAAA>
> Owner funcional: <persona/área o pendiente>
> Experiencias / recorridos: <IDs UI y J del mapa>
> Ruta: <existente aprobada / propuesta / pendiente>

Plantilla proporcional: conservar el núcleo siguiente; ampliar sólo lo que requiera el riesgo. Combinar secciones o indicar “no aplica” con motivo. No copiar estándares, marca o comandos. Ready/Done: [runbook](../CODEX_RUNBOOK.md#preparación-y-cierre); niveles de prueba: [estrategia](../TEST_STRATEGY.md).

## Propósito y alcance

Trabajo principal: “Cuando entro acá necesito…”.
Alcance del corte, tareas secundarias y exclusiones explícitas.

## Evidencia y trazabilidad

| Necesidad de matriz | Fuente original / sección / fecha de consulta | Capacidad y proceso | Regla | Experiencia / recorrido | Escenario de prueba |
|---|---|---|---|---|---|
| <ID local> | <E1:ID o sección; consulta parcial/completa> | <alcance> | <regla respaldada o propuesta> | <UI / J> | <ID local de escenario> |

Distinguir evidencia observada, diseño propuesto, decisión Broco y validación formal ABT. Registrar quién validó, cuándo y qué, o “pendiente”. Una entrevista no aprueba una solución.

## Información, capacidades y acciones

- Información primaria para decidir; secundaria bajo demanda.
- Capacidades necesarias, sensibilidad y datos a excluir; sin perfiles definitivos inventados.
- Acción principal, secundarias y masivas sólo si corresponden.
- Acciones sensibles: confirmación, evidencia, motivo, permiso y auditoría.
- Responsables, vencimientos y ausencia de datos conocida.

## Navegación y contexto

Entradas, salidas, breadcrumb, URL state, retorno/foco. Por cada destino: existente y útil, contexto local o funcionalidad futura explícita. No enlazar rutas propuestas como disponibles.

## Reglas, estados y recuperación

| Regla / fuente | Respuesta de interfaz | ¿Bloquea y por qué? | Excepción / pendiente |
|---|---|---|---|
| <referencia> | <respuesta> | <criterio respaldado> | <tratamiento> |

Distinguir dimensiones del objeto (operativa, documental, controles, administrativa) de estados de pantalla.

| Escenario alternativo aplicable | Qué ve la persona / qué se preserva | Cómo continuar |
|---|---|---|
| <loading, empty, filtered-empty, error, sin permiso, read-only, parcial, stale, blocked, guardado/conflicto> | <comportamiento particular> | <recuperación real> |

## Responsive, accesibilidad y ayuda

Aplicar [estándar](../FRONTEND_STANDARD.md). Especificar diferencias: prioridad/orden en desktop, notebook, tablet y mobile; qué se resume o expande; teclado/foco y anuncios particulares. Ayuda contextual, inducción y métricas de experiencia sólo con propósito. Marca: [BRAND_USAGE](../BRAND_USAGE.md), describir únicamente una superficie nueva o excepción.

## Fuentes y fixtures

Fuente futura, frontera simple actual, datos ficticios determinísticos, fecha/origen visibles, escenarios extremos/incompletos y exclusión de datos sensibles. Indicar disponibilidad real; no prometer integración.

## Pruebas y aceptación

| Escenario | Necesidad/regla cubierta | Nivel por riesgo | Resultado esperado | Evidencia al implementar |
|---|---|---|---|---|
| <ID local> | <ID / fuente> | <unitario, componente, integración, E2E o manual> | <observable> | <pendiente o enlace a prueba> |

Criterios de aceptación verificables del corte; cubrir flujo principal, alternativos, permisos, responsive y teclado cuando apliquen. No marcar escenarios documentados como pruebas ejecutadas.

## Decisiones pendientes

| Pregunta | Impacto / bloquea qué | Tratamiento reversible | Responsable / instancia |
|---|---|---|---|
| <pregunta concreta> | <límite> | <propuesta> | <pendiente> |

## Implementación y revisión

- Feature / rutas de código / componentes DS: <existentes o previstos claramente diferenciados>.
- Pruebas y preview: <enlaces reales al existir>.
- Revisión de especificación: <persona/instancia, fecha, evidencia, resultado o pendiente>.
- Revisión de implementación: <rutas, viewports, escenarios, observaciones, ajustes y resultado o pendiente>.

Para procesos críticos ampliar: variantes por cliente/modalidad, transiciones, cardinalidades, documentos y custodia, fuentes externas, handoff entre áreas, cálculos aprobados y controles segregados.
