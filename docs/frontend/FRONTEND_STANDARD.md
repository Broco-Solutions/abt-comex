# ABT Comex — Frontend Standard

> Documento vivo · Última actualización: 09/10/2026

## Objetivo

Construir un sistema Enterprise B2B de uso diario que transmita orden, control, trazabilidad y profesionalismo.

Prioridades, en este orden:

1. Claridad.
2. Consistencia.
3. Prevención de errores.
4. Velocidad de operación.
5. Densidad útil de información.
6. Accesibilidad.
7. Responsive.
8. Calidad visual.
9. Reutilización.
10. Mantenibilidad.

La calidad premium no se logra agregando decoración. Se logra con jerarquía impecable, lenguaje preciso, alineaciones correctas, estados completos, interacciones previsibles, excelente responsive y ausencia de fricción.

Evitar estética de landing, efectos decorativos innecesarios y patrones genéricos de demo.

## Documentos complementarios

Este estándar se aplica junto con:

- `ESPECIFICACION_FUNCIONAL_FRONTEND.md`;
- `TEST_STRATEGY.md`;
- `BRAND_USAGE.md`;
- `CODEX_RUNBOOK.md`;
- `PLAN_IMPLEMENTACION.md`;
- la especificación aplicable en `docs/frontend/screens/`.

## Stack

- Next.js App Router.
- React.
- TypeScript strict.
- Tailwind CSS.
- shadcn/ui sobre Base UI.
- Lucide.
- pnpm.
- Turborepo.

Las herramientas de pruebas se definen en `TEST_STRATEGY.md` y deben mantenerse compatibles con la versión real del stack.

## Design System

Toda decisión visual reutilizable debe expresarse mediante tokens o componentes compartidos.

No introducir arbitrariamente:

- colores hexadecimales;
- tamaños de fuente;
- spacing;
- radios;
- sombras;
- alturas de controles;
- breakpoints;
- variantes semánticas;
- animaciones.

Los colores semánticos mantienen el mismo significado en toda la aplicación:

- primary;
- success;
- warning;
- destructive;
- info;
- neutral.

El color nunca será la única señal de estado.

Un patrón nuevo y reusable se incorpora primero a `/design-system`, se documenta y recién después se utiliza en pantallas reales. Un ajuste específico de una sola pantalla no debe inflar el Design System.

## Tipografía y jerarquía

La tipografía y su escala se definen globalmente.

No modificar fuentes o escalas por pantalla salvo decisión explícita.

Toda pantalla debe tener una jerarquía reconocible:

1. contexto y ubicación;
2. título y propósito;
3. acción principal;
4. información que requiere atención;
5. contenido operativo;
6. acciones secundarias.

Evitar:

- títulos de estilo marketing dentro del producto;
- subtítulos redundantes;
- demasiados pesos tipográficos;
- bloques con igual jerarquía visual cuando tienen distinta importancia;
- texto técnico que no pertenece al lenguaje de ABT.

## Estructura de pantallas

Cada pantalla responde a un trabajo principal y utiliza uno de los patrones definidos en la especificación funcional:

- cockpit personal;
- bandeja de trabajo;
- listado operativo;
- página de objeto;
- creación guiada;
- cola administrativa;
- análisis de gestión;
- configuración.

No combinar varios patrones sin una razón funcional clara.

Cada vista debe tener especificación en `docs/frontend/screens/` antes de considerarse lista para implementación.

### Composición y ancho de lectura

- Los bloques relacionados deben percibirse como una única experiencia y
  conservar proximidad visual.
- No distribuir contenido relacionado en extremos opuestos de una superficie
  amplia mediante `space-between`.
- Usar anchos de lectura controlados y grillas explícitas para definir la
  relación entre columnas.
- Evitar grandes vacíos sin propósito que transmitan sensación de contenido
  faltante.
- La densidad útil y la composición deliberada forman parte de la calidad
  visual; no se compensan con altura mínima, cards o decoración.

## Navegación y estado en URL

- La navegación debe ser predecible y mantener contexto.
- Los destinos principales inactivos deben parecer disponibles, no disabled;
  no usar texto secundario excesivamente tenue como color principal del menú.
- Destino seleccionado, sección activa e inactividad deben diferenciarse con
  múltiples señales: peso, indentación, espaciado, fondo, indicador e icono,
  además del color. Sólo el destino seleccionado usa `aria-current="page"`.
- Hover y foco deben ser inequívocos, y el foco visible no puede depender del
  estado hover.
- En desktop/notebook, una navegación compacta opcional mantiene un rail
  permanente, destinos completos mediante nombre accesible y tooltip, targets
  mínimos de 44 × 44 px y acceso por teclado a cualquier subnivel. La variante
  expandida es el estado inicial; tablet/mobile usan drawer completo.
- El rail de referencia mide 4.5rem (72 px): deriva de un target de 44 px más
  espacio lateral del sistema y libera espacio real sin comprometer zoom ni
  foco. No se ofrece resize manual.
- La preferencia visual puede persistirse localmente detrás de un provider
  aislado mientras no exista identidad; un valor inválido vuelve a expandida y
  el modo overlay nunca se persiste.
- Breadcrumbs expresan jerarquía, no historial del navegador.
- Filtros, búsqueda, período, agrupación, ordenamiento y paginación relevantes deben reflejarse en URL cuando permitan compartir, recargar o volver sin perder contexto.
- Una acción desde Inicio, Gestión o un indicador debe llevar a una vista filtrada explicable.
- El botón Atrás del navegador no debe romper el flujo ni descartar estado importante de forma inesperada.
- No usar tabs como sustituto de rutas cuando la vista necesita enlace propio, permisos propios o carga independiente.

## Arquitectura de componentes

### `packages/ui`

Contiene componentes genéricos sin conocimiento del negocio:

- Button;
- Input;
- FormField;
- Dialog;
- Popover;
- DataTable;
- DateRangePicker;
- EmptyState;
- Alert;
- Badge semántico;
- utilidades y tokens.

### `apps/web`

Contiene composición, lenguaje y lógica de producto:

- AppShell;
- OperationHeader;
- OperationTimeline;
- ClientSummary;
- QuoteLinesEditor;
- WorkQueue;
- onboarding contextual;
- adaptadores de fixtures;
- pantallas y features.

No introducir conceptos ABT dentro de `packages/ui`.

## Formularios

- Todo campo tiene label visible.
- Required y optional deben ser inequívocos.
- Placeholder no reemplaza label.
- Los errores se muestran junto al campo correspondiente.
- Los mensajes deben ser específicos y accionables.
- Nunca borrar datos ingresados debido a una validación.
- Read-only y disabled deben distinguirse correctamente.
- Evitar validar agresivamente mientras la persona escribe.
- Calcular antes que pedir.
- Reutilizar antes que recargar.
- Seleccionar antes que escribir libremente cuando exista catálogo.
- Mostrar la procedencia de datos precargados cuando afecte decisiones.
- Confirmar sólo acciones de impacto; no llenar el sistema de dialogs preventivos.
- Los formularios largos usan secciones, revelado progresivo o creación guiada.

## Mensajes y feedback

Evitar mensajes genéricos como:

- “Error”.
- “Campo inválido”.
- “Algo salió mal”.

Todo mensaje debe indicar, cuando corresponda:

1. qué ocurrió;
2. dónde ocurrió;
3. qué información se preservó;
4. cómo corregir o continuar;
5. si depende de otra persona, permiso o integración.

Mostrar claramente:

- guardando;
- guardado;
- cambio pendiente;
- sincronización;
- éxito;
- advertencia;
- bloqueo;
- desactualización;
- conflicto de actualización.

No usar toasts como único registro de información importante o como sustituto de feedback inline.

## Patrones operativos

Listados, detalles, formularios, filtros, búsquedas, dialogs, confirmaciones, acciones, ayuda y estados deben funcionar igual en todos los módulos.

No crear un patrón nuevo si ya existe uno equivalente.

Acciones equivalentes deben usar:

- mismo nombre;
- mismo icono cuando corresponda;
- misma posición relativa;
- misma confirmación;
- mismo tipo de feedback.

## Responsive

Responsive es parte de la implementación, no una etapa posterior.

Objetivos:

- Desktop amplio: experiencia completa.
- Notebook: experiencia completa y densa.
- Tablet: completamente operativa, con priorización explícita.
- Mobile: funcional, comprensible y orientada a tareas esenciales.

Viewports de revisión manual mínimos:

- 1440 px;
- 1280 px;
- 1024 px;
- 960 px;
- 900 px;
- 820 px;
- 768 px;
- 390 px.

No asumir que responsive significa únicamente evitar overflow. También deben revisarse jerarquía, orden de lectura, tamaño táctil, acciones disponibles, dialogs, popovers, navegación y densidad.

### Datos y tablas

- El scroll horizontal no es la solución principal para tablas.
- Desktop y notebook respetan las columnas que la persona seleccionó.
- Tablet usa un preset compacto explícito de campos esenciales; no se ocultan columnas de forma errática durante un resize.
- Mobile representa listados complejos como registros compactos expandibles.
- Acciones esenciales y estado permanecen visibles; la información secundaria se revela bajo demanda.
- El scroll horizontal es un fallback excepcional para tareas que requieran comparar matrices amplias.
- Cada tabla declara metadatos de campos agrupables.
- Agrupación actualiza conteo, subtotales y presentación.
- Nunca sumar importes de monedas diferentes.

#### Política de anchos de columna

- Las tablas operativas usan `DataTable`.
- Cada columna declara exactamente uno de `fixed` o `flexible`, además de `priority`, `truncate` y `align`.
- `DataTable` renderiza `colgroup`, `table-layout: fixed` y ancho total del contenedor.
- No usar `size`, `minSize` o `maxSize` de TanStack como restricciones CSS independientes sobre `th` y `td`.
- Selección, referencia, fecha, moneda, importe y estado son fijas.
- Cliente, proveedor/destino y responsable son flexibles.
- Importe usa números tabulares, se alinea a la derecha y no repite moneda si existe una columna separada.
- Sólo truncar texto variable; mantener contenido completo mediante `title` o tooltip accesible.
- Nunca truncar checkbox, referencia, estado, fecha, moneda ni importe.
- La tabla ocupa 100% del contenedor y no depende de un `min-width` global.
- Todo header ordenable hace clickeable toda su superficie y mantiene indicador visible neutro, ascendente y descendente, `aria-sort`, foco visible y ciclo sin orden → ascendente → descendente → sin orden.
- Si existe ajuste manual de anchos, se limita a desktop/notebook, opera sobre `colgroup`, es accesible por teclado y no convierte el scroll horizontal en comportamiento normal.

### Fechas

- Toda fecha visible usa `DD/MM/AAAA`.
- Fecha y hora usa `DD/MM/AAAA HH:mm`.
- El formato se resuelve con helpers reutilizables.
- Los rangos de fecha deben poder limpiarse y entenderse sin interpretar formatos ambiguos.

## Estados transversales

Diseñar explícitamente cuando correspondan:

- loading;
- loaded;
- empty;
- filtered-empty;
- error recuperable;
- error no recuperable;
- sin permiso;
- información parcial;
- integración desactualizada;
- sólo lectura;
- disabled;
- acción bloqueada;
- borrador;
- guardando;
- guardado;
- conflicto de actualización;
- conectividad degradada.

Cada estado debe preservar estructura y contexto suficientes para que la persona comprenda dónde está y qué puede hacer.

## Accesibilidad

Piso obligatorio: WCAG 2.2 AA.

Como mínimo:

- navegación completa por teclado;
- focus visible y no oculto;
- orden de foco coherente;
- contraste adecuado;
- labels y nombres accesibles correctos;
- targets táctiles razonables;
- estados no comunicados sólo mediante color;
- errores asociados a controles;
- dialogs, drawers y popovers con foco administrado;
- tablas con semántica y encabezados correctos;
- contenido dinámico anunciado cuando corresponda;
- animaciones respetan preferencias de movimiento reducido.

No considerar accesible una pantalla sólo porque una auditoría automática no detecta errores.

## Onboarding y ayuda

- La interfaz debe ser comprensible sin depender de un tour.
- Primer acceso y checklists son no bloqueantes.
- La persona puede omitir, retomar y reiniciar ayuda.
- El estado de inducción puede ser global, pero un panel extenso se muestra
  sólo en la ruta designada para orientación; no reserva espacio en el resto
  de las pantallas ni fuerza redirecciones.
- La ayuda global puede conducir declarativamente a esa ruta conservando el
  progreso existente.
- Las guías se implementan cuando el flujo real está estable.
- La ayuda contextual explica conceptos, bloqueos y próximos pasos sin repetir información evidente.
- No pedir a la persona que elija su rol; la experiencia deriva de capacidades.
- Onboarding y ayuda deben tener pruebas funcionales.

## Branding

Aplicar íntegramente `BRAND_USAGE.md`.

- ABT Comex es la marca principal.
- Usar únicamente logos oficiales.
- El patrón “Powered by Broco Solutions” es atribución secundaria y se implementa mediante un componente reusable.
- En navegación adaptable, las marcas secundarias siguen el patrón expandido =
  marca completa / compacto = isotipo; el texto visible no repite un nombre ya
  contenido en el logo.
- No colocar atribución repetida en el cuerpo de cada pantalla.
- No deformar, recrear ni recolorear logos arbitrariamente.
- No cargar logos desde dominios externos.

## Evitar apariencia genérica de IA

- Evitar exceso de cards, iconos decorativos y grids artificialmente simétricos.
- No usar badges para datos que no expresan estados.
- Evitar grandes espacios vacíos, títulos de landing y redondeo excesivo.
- No repetir resúmenes equivalentes en tarjetas distintas.
- Priorizar contenido, jerarquía y herramientas operativas.
- Usar terminología real del dominio.
- Evitar copy grandilocuente dentro de la aplicación.
- La estructura responde al trabajo de la persona, no a una plantilla visual.

## Performance y experiencia percibida

- Evitar convertir todo en Client Component.
- Cargar gráficos y módulos pesados sólo cuando se necesiten.
- Mantener feedback inmediato en interacciones locales.
- Evitar saltos de layout evitables.
- Usar skeletons sólo cuando representen la estructura real.
- No bloquear la pantalla completa por cargas parciales.
- Mantener interacciones fluidas en notebook y mobile razonables.
- Toda optimización debe medirse; no introducir complejidad especulativa.

## Pruebas

Aplicar `TEST_STRATEGY.md`.

Cada feature agrega el nivel de prueba adecuado a su riesgo:

- unitarias para lógica pura;
- componentes para interacción y accesibilidad;
- integración de pantalla para comportamientos coordinados;
- E2E para recorridos críticos;
- revisión visual humana para cambios perceptibles.

No aceptar una feature crítica con lógica sin pruebas porque “todavía usa mocks”.

## Definition of Ready

Una pantalla o flujo está listo para implementarse cuando:

- tiene propósito y trabajo principal claros;
- existe especificación en `docs/frontend/screens/`;
- requisitos de origen identificados;
- información y acciones principales definidas;
- reglas, estados y permisos conocidos o marcados como pendientes;
- comportamiento responsive esperado;
- escenarios de prueba definidos;
- alcance y fuera de alcance explícitos.

## Definition of Done

Una pantalla o feature relevante no está terminada hasta que:

- respeta alcance y especificación;
- usa tokens y componentes existentes;
- mantiene consistencia entre pantallas;
- funciona responsive;
- contempla estados relevantes;
- es usable con teclado;
- cumple WCAG 2.2 AA;
- los errores son claros y recuperables;
- no presenta errores evitables de consola;
- TypeScript pasa;
- lint pasa;
- build pasa;
- `git diff --check` pasa;
- pruebas requeridas pasan;
- documentación afectada está actualizada;
- marca y atribución están correctas;
- fue revisada visual y funcionalmente por una persona.
