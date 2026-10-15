# Clientes, Proveedores y organizaciones — listado, ficha y ABM

> Estado: Under review
>
> Etapa: 6 — Clientes
>
> Experiencias / recorridos: CLI-01, CLI-02, SUP-01, SUP-02; J1, J5, J7
>
> Rutas: `/clientes`, `/clientes/[clientId]`, `/proveedores`, `/proveedores/[organizationId]`

## Propósito y alcance

Gestionar organizaciones sintéticas reutilizables con identidad común y roles
diferenciados: cliente ABT, proveedor contratado ABT y contraparte de una
operación del cliente. Alta/edición, contactos múltiples, coincidencias,
inactivación/reactivación y uso contextual en Cotizaciones/Operaciones.
No es CRM ni maestro conectado. Fuente por campo, requisitos fiscales y
capacidades definitivas siguen pendientes de ABT.

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
- La ficha muestra procedencia y fecha simulada, identidades de contacto inventadas sin datos personales reales y operaciones vinculadas por ID estable; las altas locales de Etapa 5 aparecen en la misma sesión.
- Una operación puede abrir la ficha de su cliente y retornar al detalle; la ficha puede abrir la operación y recuperar el contexto de Clientes.
- Sin datos, coincidencias, permiso o lectura se muestra el estado correspondiente sin exponer filas ni conteos en el estado restringido.
- V3 habilita alta/edición exclusivamente local y estado por rol. Configuración particular de requisitos, aprobación e integración externa siguen pendientes.
- La ficha ofrece navegación filtrada a Cotizaciones por `clientId`; no muestra valores, honorarios, filas ni conteos comerciales. El acceso efectivo depende de una capacidad que el prototipo no implementa.

## Reglas, sensibilidad y procedencia

Los nombres, etiquetas de contactos y relaciones son completamente ficticios.
No se incluyen CUIT, direcciones, correos, teléfonos, importes, honorarios,
márgenes ni datos de personas reales. La fuente se presenta como fixture local
no conectado y su fecha es simulada. Las capacidades implementadas no
constituyen autorización ni seguridad productiva.

## Responsive y accesibilidad

UX-02 usa DataTable compacto en desktop/tablet y lista de registros en móvil. Cliente, operaciones relacionadas, actualización y apertura; orden alfabético predeterminado. Sin selección, agrupación ni personalización innecesaria. Búsqueda local con URL recuperable; enlaces y
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
- Integrar documentos/actividad cuando sus fuentes estén disponibles.
- Determinar qué requisitos pueden configurarse por cliente y quién puede hacerlo; no se crea un configurador ni motor de reglas.
- Definir capacidades efectivas; las etiquetas de demostración no son seguridad.

## Implementación y revisión

- Código: `apps/web/features/clients/`; datos sintéticos relacionados mediante `clientId` en `features/operations`. La lista y la ficha leen la fuente local compartida para reflejar aperturas de Etapa 5 sin duplicar operaciones.
- Pruebas: `features/clients/data/clients.test.ts`, pruebas de componentes/a11y y `apps/web/e2e/specs/stage-06-clients.spec.ts`.
- PR #10 integrado a `main` (`26f19d9`); `quality`, `e2e-smoke` y Vercel Preview verdes. Deployment `dpl_8vmJ5fUR8bPm3qb4ymGrPVZsjr2S` READY; `/clientes` y `/clientes/client-demo-norte` respondieron HTTP 200.
- Lint, typecheck, build, 55 pruebas unitarias, 13 axe y 19 E2E smoke Chromium seriales pasaron; validador documental y `git diff --check` pasaron. Capturas locales revisadas a 1440×1000 y 390×844, sin overflow horizontal.
- Estado: Under review hasta revisión humana funcional/visual integral. La demostración está en un dominio personalizado público; contiene únicamente fixtures sintéticos y no está lista para uso operativo.

UX-02: referencia enlazada y apertura visible; detalles personales/procedencia en ficha. Una tabla ayuda a comparar clientes sin trasladar toda la ficha al listado. La búsqueda y retorno existentes se conservan.

## V3-02 — comportamiento vigente

- Datos compartidos en features/organizations; fixtures iniciales preservan IDs históricos. Cambios temporales por sesión, reiniciados al cambiar escenario o salir.
- Proveedores localizables desde navegación; subvista separada de contrapartes operativas. Un vendedor extranjero de mercadería no genera deuda de ABT.
- Nombre y rol requeridos para preparación local. País requerido sólo cuando se informa identificación; no se valida CUIT/regla fiscal inexistente. Dirección y contactos opcionales. Campos y autoridad externa a validar.
- Posibles duplicados por nombre normalizado o identificación/país: reutilización explícita agrega/reactiva el rol sin duplicar identidad; coincidencia dudosa puede confirmarse como distinta, sin fusión automática.
- Roles existentes no se borran al editar; inactivación con confirmación conserva historial, operaciones y demás roles. Se excluyen de nuevas selecciones, no de relaciones históricas.
- Contactos: agregar, editar y quitar en formulario local; actividad de cambios. No se copian contactos reales.
- Nuevo cliente desde Cotización/alta de Operación abre diálogo sin abandonar el borrador, selecciona el registro creado y actualiza consumidores. Fichas y nombres relacionados consultan la misma fuente.
- Sin registro contable ni comunicación externa; la ficha de proveedor no inventa importes o compromisos. Sus relaciones financieras se completan en incrementos consumidores.
- Pruebas: organizations.test, organizations.a11y, v3-organizations; regresión de Clientes, Cotizaciones, apertura y confidencialidad. Evidencia de ejecución sólo en plan.
