# Clientes — listado y ficha

> Estado: Under review
>
> Etapa: 6 — Clientes
>
> Experiencias / recorridos: CLI-01, CLI-02; J1, J5
>
> Rutas: `/clientes`, `/clientes/[clientId]`

## Propósito y alcance

Consultar el contexto maestro reutilizable de clientes y volver desde sus
relaciones a la operación adecuada. Esta es una vista de demostración
read-only, no un CRM ni un maestro operativo conectado. Alta, edición,
deduplicación, validación de campos y responsables requieren definiciones
pendientes con ABT.

## Evidencia y trazabilidad

| Necesidad | Fuente | Comportamiento en esta pasada | Estado |
|---|---|---|---|
| CLI-001 | Matriz de Cobertura; alcance funcional §4.1 | Listado y ficha con identificador, nombre, procedencia, actualización y contactos ficticios | Base documentada; campos y unicidad pendientes |
| CLI-002 | Matriz de Cobertura; alcance §4.1 y procesos de Importación/Exportación | Las operaciones sintéticas conservan relación con su cliente por `clientId`; no se simulan roles de participantes | Tipos y datos obligatorios pendientes |
| CLI-004 | Matriz de Cobertura; mapa CLI-02 y J1/J5 | Ver operaciones relacionadas y navegar a su detalle con retorno | Cotizaciones, documentos y actividad se incorporan en etapas consumidoras |
| COV-002 | Matriz transversal; alcance de reutilización | Cliente compartido por las operaciones de referencia, sin duplicar el nombre como clave relacional | Cardinalidades de negocio pendientes |

No hay aprobación formal de ABT de la propuesta de pantalla o de los campos.

## Información e interacciones

- `/clientes` busca por nombre de cliente o referencia de operación; búsqueda y retorno se conservan en URL.
- La lista identifica el volumen como perteneciente al fixture, no al total de ABT.
- La ficha muestra procedencia y fecha simulada, identidades de contacto inventadas sin datos personales reales y operaciones vinculadas por ID estable.
- Una operación puede abrir la ficha de su cliente y retornar al detalle; la ficha puede abrir la operación y recuperar el contexto de Clientes.
- Sin datos, coincidencias, permiso o lectura se muestra el estado correspondiente sin exponer filas ni conteos en el estado restringido.
- No se habilita alta, edición, configuración, aprobación, integración externa ni escritura.
- Cotizaciones, documentos y actividad no se inventan; se explicita que no forman parte aún del fixture y se integrarán en sus etapas consumidoras.

## Reglas, sensibilidad y procedencia

Los nombres, etiquetas de contactos y relaciones son completamente ficticios.
No se incluyen CUIT, direcciones, correos, teléfonos, importes, honorarios,
márgenes ni datos de personas reales. La fuente se presenta como fixture local
no conectado y su fecha es simulada. Las capacidades implementadas no
constituyen autorización ni seguridad productiva.

## Responsive y accesibilidad

El listado usa filas que se apilan en mobile sin tabla de ancho fijo ni
overflow horizontal. Búsqueda mediante formulario GET nativo; enlaces y
acciones conservan foco de teclado visible. Los estados vacíos y de error
usan anuncios semánticos. axe es apoyo automatizado, no certificación WCAG;
revisión humana integral pendiente.

## Pruebas y aceptación

| Escenario | Resultado esperado | Prueba |
|---|---|---|
| Listado y apertura | Fichas disponibles y retorno conserva filtros | Unit/componentes y E2E |
| Búsqueda por referencia | Abre el cliente relacionado con la operación | Lógica unitaria y E2E |
| Relación Cliente → Operación → Cliente | Mantiene las relaciones y contexto de retorno | E2E |
| Filtro vacío | Explica que no hay coincidencias y permite limpiar | Componentes |
| Sin permiso o error de lectura | No filtra conteos ni filas; error recuperable conserva consulta | Componentes |
| Ficha no existente | Usa el estado 404 del producto | E2E/manual |
| Mobile y teclado | Sin overflow y acciones alcanzables | E2E y revisión humana pendiente |

## Pendientes

- Definir con ABT campos, unicidad, fuente maestra, responsables y deduplicación.
- Validar catálogo y atributos de participantes/contrapartes.
- Integrar cotizaciones/documentos/actividad cuando sus fuentes estén disponibles.
- Determinar qué requisitos pueden configurarse por cliente y quién puede hacerlo; no se crea un configurador ni motor de reglas.
- Definir capacidades efectivas; las etiquetas de demostración no son seguridad.

## Implementación y revisión

- Código: `apps/web/features/clients/`; datos sintéticos relacionados mediante `clientId` en `features/operations`.
- Pruebas: `features/clients/data/clients.test.ts`, pruebas de componentes/a11y y `apps/web/e2e/specs/stage-06-clients.spec.ts`.
- Estado: Under review hasta revisión humana funcional/visual integral. Resultado de PR, checks y deployment se registrará tras integración.
