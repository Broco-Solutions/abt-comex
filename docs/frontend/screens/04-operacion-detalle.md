# Operaciones — detalle común

> Estado: Under review
> Etapa: 4 — Detalle común de Operación
> Actualización: 14/10/2026
> Validación funcional ABT: pendiente
> Experiencias / recorridos: OPS-03, OPS-05; J1, J2, J3, J6, J7, J10
> Ruta: `/operaciones/[operationId]` (propuesta en el mapa; prototipo habilitado)

## Propósito y alcance

Dar una ficha común desde la que la persona reconoce la operación, su cliente, tipo, responsable de referencia, situación sintética, próxima acción y actualidad del dato. Es el contexto compartido para las etapas funcionales específicas. El corte no materializa cambios de negocio, controles reales, aprobación, oficialización ni integración externa.

## Evidencia y trazabilidad

| Necesidad                          | Evidencia / autoridad                                     | Experiencia y recorrido | Tratamiento de este corte                                                                                                         |
| ---------------------------------- | --------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| COV-001, COV-002, OPE-003          | Matriz de cobertura; alcance §4.3; mapa OPS-03            | OPS-03; J1, J2, J3, J6  | Fixture con ID estable, cliente, tipo, responsable, situación y actualización sintéticos.                                         |
| OPE-005, DOC-001–004, CTRL-001–003 | Matriz; procesos de Importación/Exportación               | OPS-05; J2, J3, J6, J10 | La ficha comparte requisitos/copias sintéticas con los workspaces y deriva al control propio del proceso; no infiere transiciones.      |
| FIN-001–009; COV-006               | Alcance §7.2; matriz; decisión económica vigente          | OPS-03; J3, J7          | No renderiza datos económicos. La sección explica límites y separación de situaciones; sin perfil ni permiso productivo simulado. |
| COV-008, INT-001, ALP-001          | Matriz de cobertura; estrategia de integraciones del plan | OPS-03; J10             | Muestra escenario sintético local y que Alpha2000 no está conectada; no atribuye fuente externa.                                  |

## Información, acciones y navegación

V3-06 comparte responsable individual, contrapartes y coordinación administrativa
con Importación/Exportación. La nómina relevada se selecciona explícitamente por
ID: conocer un área no asigna operaciones, tareas ni acceso. Sin selección se
muestra pendiente; los equipos históricos quedan como referencias del escenario.
Se vinculan sólo roles operativos activos; una organización multirrol conserva
su identidad y sus relaciones al desvincularla. La ficha de contraparte muestra
participaciones y permite volver al contexto exacto. El envío administrativo
exige próxima acción/observación y conserva historial; recibir para revisión no
factura, cobra, cumple ni cierra la operación. El Portal no incorpora estos
campos internos. El evento sintético `openedOn` identifica la apertura para el
posterior análisis; no se sustituye por última actualización.

- La cabecera identifica referencia ficticia, cliente, tipo, situación de referencia, equipo responsable, modalidad y fecha del escenario.
- Si el registro se abrió durante la sesión local, muestra su contexto inicial y si nació de alta directa o de una versión de Cotización aceptada; el vínculo conserva el ID y versión de origen.
- “Próximo paso” reproduce la orientación sintética existente; no crea una tarea ni afirma una acción cumplida.
- Documentación muestra requisitos, copias y originales por separado. Controles derivan al proceso específico; enlaces comerciales/administrativos sólo aparecen con las capacidades de evaluación correspondientes.
- En Importación hay un destino útil al workspace específico, desde la acción principal y las secciones de documentos/controles; el retorno conserva el contexto de esta ficha. Exportación tiene el workspace correspondiente, conservando el retorno.
- “Volver a resultados” conserva filtros del listado o el contexto de Mi trabajo. El retorno admite contextos internos conocidos (cliente, trabajo, análisis, Administración o listado), muestra un nombre acorde al destino y conserva URL; una ruta inválida vuelve al listado.
- El enlace de tipo conduce al listado filtrado, destino existente y útil.
- La ficha es de consulta; se retiró el botón de edición sin función. La recepción local de copias modifica sólo el escenario y no contacta fuentes externas.

## Reglas, privacidad y límites

Las situaciones existentes son vocabulario de fixture, no un catálogo aprobado por ABT. No se infieren hitos, controles, documentos, etapas regulatorias, aprobaciones o bloqueos a partir de esos valores.

No se exponen honorarios, costos, facturación, cobranza ni márgenes. La explicación recuerda que el responsable operativo no obtiene acceso económico automáticamente. Este límite visual no implementa autorización real; la matriz de capacidades continúa pendiente.

La fuente indicada es “Escenario sintético local”; Alpha2000 aparece desconectada. La fecha corresponde al registro ficticio. Sin permiso, la vista no confirma si el identificador existe y no publica datos.

## Estados y recuperación

| Estado                                                     | Presentación                                                                                        |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Registro sintético disponible                              | Ficha común sin acciones externas; procedencia y fecha visibles.                                    |
| ID desconocido                                             | Not-found del App Router, sin detalles del registro.                                                |
| Sin permiso (escenario de UI)                              | Mensaje genérico, sin confirmar existencia; regreso a Operaciones. No equivale a autorización real. |
| Fuente externa                                             | No conectada; no se simula actualización.                                                           |
| Información documental/controles/administración incompleta | Límites explícitos y vínculo a destino útil existente; no se representa como ausencia en ABT.       |

## Responsive y accesibilidad

Los datos de identidad usan una grilla que cae a una columna en móvil; bloques y acciones fluyen verticalmente sin tablas ni scroll horizontal. Enlaces operables por teclado con foco visible, jerarquía de títulos, listas de definición semánticas y mensajes no basados sólo en color. Axe automatizado no sustituye revisión humana WCAG.

## Fixtures y pruebas

La ficha reutiliza la fuente de operaciones sintéticas de Etapa 3, compartida en la sesión con el alta de Etapa 5; no hay un segundo registro ni nuevas reglas/datos monetarios. Pruebas cubren identidad, confidencialidad, permiso sin filtración, sanitización del retorno y navegación listado/mi-trabajo → ficha → retorno, incluidos origen y contexto de aperturas locales.

## Decisiones pendientes

- Confirmar ID oficial, estados generales, etapas, responsables y transiciones con ABT.
- Definir el modelo de eventos, trazabilidad y actividades.
- Validar permisos/capacidades de detalle y separación por sección.
- Definir qué resumen documental, controles y referencias administrativas puede mostrar la ficha común y cuándo cada dominio es fuente autorizada.

## Implementación y revisión

- Código: `apps/web/features/operations/components/operation-detail.tsx`; ruta `apps/web/app/(app)/operaciones/[operationId]/page.tsx`.
- Integración: enlaces de Operaciones y Mi trabajo reemplazan el contexto temporal por esta ficha, conservando retorno; Importación abre su workspace específico `/operaciones/[operationId]/importacion` sin consultar Alpha2000/MARÍA.
- Estado técnico: PR #9 integrado (`80d7714`), checks requeridos verdes; deployment `dpl_AqoCyjYC3CYEnwNwz86kA1VZi2P7` READY. Lint, typecheck, 49 unitarias, 12 axe, build, validador documental y 17 E2E smoke Chromium pasan; revisión visual automatizada observada a 1440×1000 y 390×844, sin overflow horizontal. Revisión humana integral pendiente.
- Validación formal/funcional ABT: pendiente.

## UX-06 — refinamiento implementado

Identidad y próximo paso permanecen visibles; procedencia secundaria se despliega con Chevron y teclado nativo. Documentación comparte el modelo de requisitos/copias con Importación/Exportación y consultas guiadas; no es una tabla general ni duplica el registro. Acciones sensibles se rotulan localmente y la identificación global evita avisos repetidos. El origen comercial abre su versión exacta, no la última por accidente; retorno explícito al contexto.
