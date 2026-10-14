# Etapa 12 — Portal de Clientes

> Estado: Under review
>
> Etapa: 12 — Portal de Clientes
>
> Última actualización: 14/10/2026
>
> Owner funcional: ABT, pendiente de asignación/validación
>
> Experiencias / recorridos: POR-01, POR-02, POR-03; J8, J10
>
> Rutas: `/portal/acceso`, `/portal`, `/portal/operaciones/[operationId]` (propuestas; corte demostrativo)

## Propósito y alcance

Permitir que un contacto externo explore información operativa seleccionada
para su organización dentro de un escenario ficticio. La experiencia tiene
estructura, lenguaje, navegación y proyección de datos propios; no reutiliza el
Application Shell interno.

Este corte incluye una entrada demostrativa, una única identidad de ejemplo
(`Cliente Demo Centro`), una lista de operaciones relacionadas, un detalle
externo limitado, situaciones del fixture, estados de documentación, ayuda y
un aviso visible de que no se envían notificaciones. No implementa identidad,
sesión segura, invitaciones, revocaciones, descargas/cargas, mensajería,
notificaciones reales ni auditoría productiva.

## Evidencia y trazabilidad

| Necesidad de matriz | Fuente / alcance de consulta                                                                | Capacidad / proceso                                  | Regla o límite del corte                                                                                            | Experiencia / recorrido |
| ------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| POR-001             | L1 §4.9; mapa POR-01. Requisito documentado; perfiles y visibilidad fina pendientes de ABT. | Acceso externo a Cliente/Operaciones autorizados     | Una identidad ficticia permitida por lista; no es autenticación ni decisión real de permisos.                       | POR-01; J8              |
| POR-002             | L1 §4.9; mapa POR-02.                                                                       | Inicio, operaciones, hitos, pendientes, ayuda/avisos | Reutilizar relaciones estables del fixture; mostrar estado y fecha del registro, no tareas/notas internas.          | POR-02; J8, J10         |
| POR-003             | L1 §4.9; mapa POR-03.                                                                       | Detalle externo, documentos compartidos y pendientes | Proyectar sólo campos explícitos; no existen documentos compartidos en este fixture. No inferir aprobación externa. | POR-03; J8, J10         |

La matriz conserva la autoridad sobre evidencia, certeza y validación. El
alcance §4.9 mantiene honorarios, costos, cobranzas internas, comentarios y
auditoría interna fuera de la vista externa por defecto. Ninguna conversación
o implementación mock acredita aprobación formal de ABT.

## Información, capacidades y acciones

- El escenario seleccionable es exclusivamente `Cliente Demo Centro`, con
  operaciones vinculadas por `clientId`; no se muestran otros clientes ni sus
  registros.
- La proyección externa contiene referencia sintética, tipo, situación del
  fixture y fecha de actualización. Excluye responsable, alerta, próxima acción,
  comentarios/notas, origen de cotización, controles internos y todo dato
  económico.
- Las capacidades demostrativas permiten listar operaciones relacionadas y
  abrir su detalle externo. No permiten editar, aprobar, cargar, descargar,
  responder ni enviar mensajes.
- El caso con estado `Pendiente documental` sólo comunica esa situación del
  fixture. No inventa un documento solicitado ni expone instrucciones internas.
- No hay documentos externos compartidos en los fixtures actuales. Se muestra
  un empty state explícito; carga/descarga queda fuera de este corte.
- La fecha y fuente local se identifican como datos sintéticos sin conexión.
  No se fabrican hitos históricos ni notificaciones entregadas.

## Navegación y contexto

`/portal/acceso` conduce al escenario permitido de demostración; `/portal`
lista sus operaciones y `/portal/operaciones/[operationId]` abre sólo una
operación cuyo `clientId` coincide con la identidad permitida. Se ofrece volver
a la lista. Un ID ajeno o inexistente muestra una respuesta genérica sin
revelar cliente, referencia ni existencia de registros.

La cabecera sólo ofrece navegación del Portal y cambio al selector del
escenario. No contiene enlaces a rutas internas. Los botones/acciones de
identidad, mensajería y documentos reales no se presentan como operativos.

## Reglas, estados y recuperación

| Condición                              | Respuesta de interfaz                                          | Bloqueo / tratamiento                         |
| -------------------------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| Fixture cargando                       | Estado `role=status` sin datos                                 | No confirma existencia hasta cargar           |
| Sin operaciones del cliente autorizado | Empty state propio del Portal                                  | No muestra conteos de otros clientes          |
| Operación ajena o desconocida          | Mensaje genérico de contexto no disponible y retorno al Portal | No identifica si existe ni publica sus campos |
| Documentos compartidos ausentes        | Empty state con nota de función futura                         | Sin botones de carga/descarga inertes         |
| Fuente fixture                         | Etiqueta de actualización fija y sin consulta externa          | No simula sincronización ni notificación      |

## Responsive, accesibilidad y marca

Diseño de una columna con lectura priorizada, navegación táctil y tablas/listas
sin desbordamiento global. Links son teclado-operables y tienen nombres
accesibles; estados se comunican con texto además de color. La marca ABT usa
assets oficiales. `BrandAttribution` es secundaria en el pie. La superficie
mantiene WCAG 2.2 AA como objetivo; axe y las pruebas automatizadas no
reemplazan inspección manual.

## Fuentes y fixtures

La fuente actual es el estado local de `features/operations` y los clientes
sintéticos existentes. Una función de proyección filtra por cliente antes de
formar el modelo consumido por el Portal. No se consulta API, storage externo,
identidad, correo ni archivos reales. Los permisos mock no constituyen una
frontera de seguridad; el producto real requiere autorización del lado servidor
y validación de visibilidad, auditoría y documentos.

## Pruebas y aceptación

- POR-01: el selector sólo anuncia escenario ficticio y no pide credenciales.
- POR-02: lista operaciones del cliente demo y no revela filas del resto de
  clientes; muestra fuente/frescura y aviso de mensajes no enviados.
- POR-03: detalle sólo se abre cuando la relación con la identidad coincide;
  referencias ajenas/desconocidas son indistinguibles y no filtran campos.
- No se muestran honorarios, gastos, cobranzas, costos, alertas, responsables,
  notas internas, actividades ni `nextAction`.
- En 390, 768, 1024 y 1440 px no hay overflow horizontal global; links y
  navegación funcionan con teclado/foco visible.
- Empty state documental no contiene acciones inertes y explica que no hay
  documentos compartidos en el escenario.

## Decisiones pendientes de ABT

Identidad y proveedor; acceso/invitaciones/recuperación/revocación; contactos y
organizaciones habilitados; reglas de visibilidad campo a campo; estados e
hitos comunicables; selección de documentos externos, carga/descarga, revisión
y retención; notificaciones/canales/consentimientos; idioma y ayuda; auditoría
y permisos productivos. Este prototipo no resuelve ni aprueba esas decisiones.

## Implementación y revisión

Implementación integrada en `main` mediante PR #17 en `apps/web/features/portal`
y grupo de rutas independiente `apps/web/app/(portal)`. Hay pruebas unitarias de proyección/denegación, un
chequeo axe y recorridos E2E de acceso, detalle limitado, denegación y
responsive/teclado. Revisión técnica/documental por Codex; validación visual y
funcional humana permanece pendiente.

UX-03: /acceso ofrece entrada a Cliente externo → Portal con Shell propio. Indicador global discreto en footer. No incorpora contraseñas ni mezcla navegación interna con externa; el cliente sintético conserva su proyección autorizada.
