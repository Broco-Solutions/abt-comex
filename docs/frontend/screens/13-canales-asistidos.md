# Etapa 13 — Canales asistidos

> Estado: In implementation
>
> Etapa: 13 — Canales asistidos
>
> Última actualización: 14/10/2026
>
> Owner funcional: ABT, pendiente de asignación/validación
>
> Experiencias / recorridos: AST-01; J9, J10
>
> Superficie: consultas guiadas contextuales en `/operaciones/[operationId]`; sin ruta ni navegación principal

## Propósito y alcance

Probar si consultas de lectura breves ayudan a comprender una operación sin
crear un canal o una lógica paralela. El primer corte es determinístico,
local y activado por botones de consulta predefinidos; no interpreta texto
libre ni usa modelo, proveedor, API, mensajería o servicio externo.

Las respuestas se construyen a partir de una proyección explícita de la ficha
de operación ya visible. Muestran fuente, actualización y límite; se abstienen
cuando el dato no existe o no es confiable. No generan tareas, recomendaciones
de negocio nuevas, escrituras, aprobaciones, mensajes ni registros de auditoría
productivos.

## Evidencia y trazabilidad

| Necesidad de matriz | Fuente / certeza                                                                                | Capacidad                                                                  | Límite de esta implementación                                                                                                                                                          | Experiencia / recorrido |
| ------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| AST-001             | L1 §7.7; L6; E3 menciona bot/WhatsApp. Necesidad documentada; casos y canal pendientes de ABT.  | Consulta asistida de lectura con permisos/contexto comunes                 | Consultas determinísticas sobre una operación sintética ya autorizada; fuente, actualización y abstención visibles. No ofrece texto libre ni afirma llamar a servicios comunes reales. | AST-01; J9              |
| AST-002             | L1 §7.7; L6. Necesidad documentada para acciones futuras; no autoriza escrituras en este corte. | Confirmación, idempotencia, autorización y auditoría para acciones futuras | No hay acciones ni comandos. No se simulan confirmaciones ni auditoría.                                                                                                                | AST-01; J9              |
| AST-003             | L1 §7.7; E3; E1:DIR-005. Hipótesis de canal, no aprobación.                                     | Mantener canal/proveedor agnóstico                                         | No se integra WhatsApp, email, M365 u otro canal externo.                                                                                                                              | AST-01; J9              |

La [matriz](../MATRIZ_COBERTURA_FUNCIONAL.md) conserva fuentes, certeza y
pendientes. Esta experiencia no valida formalmente casos, vocabulario, canales,
identidad, permisos productivos ni servicios compartidos con ABT.

## Consultas disponibles

- Situación actual: responde tipo, referencia sintética, situación y fecha del
  registro, identificando el escenario como fuente.
- Próximo paso: muestra literalmente la orientación ya presente en el fixture,
  rotulada como referencia; no significa que exista una tarea asignada o se
  haya ejecutado.
- Documento faltante: si el estado indica `Pendiente documental`, explica que
  el fixture no identifica el documento; en otro caso informa que no hay
  inventario. No inventa requisitos.
- Vencimiento: se abstiene, ya que el modelo compartido no ofrece una fecha
  límite confiable.
- Estado aduanero: se abstiene; Alpha2000 y ARCA/MOA no están conectados en el
  prototipo y el fixture no confirma oficializaciones ni cumplidos.

Cada respuesta expone su fuente, fecha cuando existe y limitación. La selección
de una pregunta es local, reversible y no cambia la operación. No se copian
honorarios, costos, valores aduaneros, cobranzas, márgenes, responsables ni
información de otros clientes al modelo de consulta.

## Acceso, estados y recuperación

El bloque aparece sólo dentro del detalle común de una operación que el
escenario interno ya pudo cargar. Si el detalle está restringido o no existe,
no se monta la capacidad asistida ni se revela su contenido. Las respuestas
usan la misma referencia sintética visible en la ficha; no constituyen una
frontera de autorización productiva. En el sistema real la autorización debe
resolverse antes de entregar datos a cualquier canal.

Antes de la primera selección se comunica que no se consultó información. Al
seleccionar una pregunta se anuncia una respuesta mediante región accesible.
No hay servicio remoto recuperable ni estado de sincronización; se explicita
que no existe proveedor conectado y que la respuesta no se envía ni registra
como actividad productiva.

## Responsive, accesibilidad y marca

Las consultas se muestran como acciones con nombre, foco visible y estado
seleccionado programático; se pueden operar con teclado y se conserva una
columna fluida en móvil. La respuesta se anuncia sin depender del color y
agrupa fuente, actualización y límite con etiquetas. Se conserva Design
System, Shell y marca internos. Axe es una señal automatizada, no una
declaración de conformidad WCAG 2.2 AA.

## Fuentes y arquitectura

La función pura `answerAssistedQuestion` recibe sólo `id`, referencia, tipo,
situación, fecha de actualización y próximo paso del fixture. La UI se monta
en la ficha existente; no hay módulo de dominio paralelo, ruta nueva, proveedor
de IA, SDK, almacenamiento o permisos reales.

## Pruebas y aceptación

- AST-001: consultas guiadas responden sólo con datos presentes y citan fuente,
  actualización o su ausencia y límite.
- La pregunta por documento, plazo o estado externo se abstiene de inventar
  información.
- AST-002: no hay escritura, aprobación, confirmación ficticia ni auditoría
  productiva.
- AST-003: no hay canal externo, proveedor ni envío.
- El bloque no aparece en escenario restringido; no expone datos económicos.
- La navegación por teclado y el anuncio de respuesta son verificables; la
  interfaz no desborda en 390, 768, 1024, 1280 y 1440 px.

## Decisiones pendientes de ABT

Casos iniciales de consulta; términos y respuestas comunicables; validación
formal de cada fuente; perfiles, identidad y reglas por campo; canal (incluido
si bot/WhatsApp resulta pertinente); privacidad, retención, auditoría y
responsables; proveedor y evaluación de seguridad; toda acción futura,
confirmación, idempotencia y autorización. Esta implementación no resuelve ni
aprueba esos puntos.

## Implementación y revisión

Implementación en `apps/web/features/assisted` y composición en el detalle
común de Operaciones. La especificación se mantiene bajo revisión técnica;
validación visual y funcional humana integral permanece pendiente.
