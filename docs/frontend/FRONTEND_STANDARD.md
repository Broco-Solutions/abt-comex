# ABT Comex — Frontend Standard

## Carteras y navegación administrativa V3

La navegación secundaria de una colección administrativa no debe consumir varias filas en móvil: una franja desplazable conserva enlaces, foco y sección activa visible. Contenido y acciones principales no dependen de desplazar esa franja. Avisos de vencimiento sobre fondo neutro usan texto legible, no un token diseñado para fondo de advertencia. Consulta de flujos usa fechas del evento; cartera usa fecha de corte e incluye emisiones anteriores abiertas. Saldo desconocido, saldo conocido del escenario y saldo informado de referencia se identifican sin equipararlos.

## Contrato visual de analítica V2

Usar Recharts, ChartContainer y tokens existentes. Cada visualización declara período, unidad/moneda, dimensión, fuente y actualización; las series no mezclan monedas ni eventos. Gráfico y registros explicativos comparten datos y filtros, con selección por barra y alternativa mediante valores/enlaces accesibles sin hover. No animar cifras operativas innecesariamente. Vacío, error o información faltante no se representan como un cero confirmado. Los gráficos no sustituyen registros ni introducen fórmulas de negocio.

> Documento vivo · Última actualización: 14/10/2026

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

Este documento es autoridad de estándares transversales UX/UI. El [mapa](MAPA_PANTALLAS_Y_RECORRIDOS.md) asigna patrones a experiencias; las [especificaciones](screens/README.md) describen comportamiento particular. [Pruebas](TEST_STRATEGY.md), [marca](BRAND_USAGE.md), [arquitectura](../architecture/README.md) y [procedimiento](CODEX_RUNBOOK.md) conservan autoridad propia.

## Visión y usabilidad

Toda pantalla debe permitir entender qué ocurre, quién es responsable, qué falta, qué puede hacerse, qué está bloqueado y por qué, cuál es la próxima acción, qué información es confiable y dónde consultar el historial. La precisión funcional, flexibilidad por cliente/tipo, trazabilidad, prevención y reutilización de datos guían la composición.

Las diez heurísticas de Nielsen se aplican así; son criterios de diseño, no requisitos de negocio nuevos:

| Heurística | Aplicación ABT |
|---|---|
| Visibilidad del estado | Feedback de carga, progreso, guardado y fuentes parciales o desactualizadas. |
| Correspondencia con el trabajo real | Lenguaje ABT y procesos estructurados, sin copiar planillas ni jerga técnica. |
| Control y libertad | Cancelar/volver sin pérdida, correcciones trazables y borradores sólo donde se definan. |
| Consistencia | Misma acción y estado, mismo patrón; no depender del color. |
| Prevención | Calcular, reutilizar, seleccionar y validar relaciones; advertir si el dato podría ser válido y bloquear sólo una invalidez respaldada. |
| Reconocimiento | Mostrar próximos pasos, requisitos, responsables, controles, reglas y antecedentes reutilizables. |
| Eficiencia | Búsqueda, teclado, filtros y reutilización; recientes, vistas guardadas y acciones masivas sólo cuando el flujo los habilite. |
| Minimalismo útil | Priorizar información para decidir; evitar cards, gráficos e iconos decorativos o datos repetidos. |
| Recuperación | Error específico, datos preservados y siguiente paso; separar error de usuario, integración y permisos. |
| Ayuda | Ayuda contextual y guías breves en tareas críticas, sin tours que compensen una interfaz confusa. |

No diferir jerarquía, responsive, estados o accesibilidad a un rediseño posterior.

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

Cada pantalla responde a un trabajo principal y utiliza uno de los patrones definidos aquí:

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

La ubicación de composición, componentes, tipos y fuentes mock se define en [arquitectura](../architecture/README.md). El Design System no contiene conceptos de negocio ABT.

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

La autoridad exclusiva de assets, jerarquía ABT/Broco, atribución y superficies es [BRAND_USAGE.md](BRAND_USAGE.md).

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

## Pruebas y preparación

Aplicar [TEST_STRATEGY.md](TEST_STRATEGY.md) según riesgo. Definition of Ready, Done y registro de aprobación pertenecen al [runbook](CODEX_RUNBOOK.md#preparación-y-cierre). La conformidad automática no sustituye revisión humana.

## Catálogo de patrones transversales

| Patrón | Contrato de experiencia |
|---|---|
| Resumen personal | Priorizar excepciones, vencimientos y trabajo autorizado; cada total conduce a registros explicativos. No operar todos los procesos desde el resumen. |
| Bandeja de trabajo | Acción, contexto, responsable, prioridad explícita, vencimiento, estado, origen y siguiente paso; separar tareas, controles y aprobaciones. |
| Listado operativo | DataTable con búsqueda, filtros y período, orden desde encabezados, URL state y estados alternativos. Selección, agrupación, columnas, vistas guardadas, paginación y agregados sólo cuando el alcance y la capacidad lo permitan; Operaciones no lleva totales económicos genéricos. |
| Página de objeto | Cabecera estable con identidad, estados, situaciones, responsable y acciones; resumen/próximo paso; secciones de datos, seguimiento, documentos, controles, administración, actividad y bloques específicos. Lectura y edición reconocibles, sin cards infinitas. |
| Creación guiada | Sólo pasos necesarios y decisiones condicionales; volver sin perder, mostrar procedencia de datos precargados y resumen antes de confirmar. Borrador sujeto a definición del flujo. |
| Cola administrativa | Priorizar qué revisar/procesar; representar separadamente dimensiones operativas, documentales, facturación y cobranza según el alcance. |
| Gestión | Períodos y filtros coherentes, comparaciones y drill-down hasta registros/fuentes; gráficos sólo si explican una decisión. Exportación controlada; sin generador universal de reportes. |
| Configuración | Separar general, catálogos, reglas, requisitos documentales, permisos, integraciones y parámetros por cliente de la operación diaria. |

Las experiencias concretas y su etapa viven en el mapa; los campos y reglas se especifican por pantalla. No todo patrón implica una ruta o un componente genérico nuevo.

## Permisos, fuentes y frescura

El frontend representa autorización; no la decide. Ocultar contenido protegido o explicar una acción deshabilitada según la capacidad recibida, sin revelar información en conteos, búsqueda, KPI, tooltips, errores, actividad o exportación. No inferir perfiles definitivos. Los canales comparten la [política de confidencialidad económica del alcance §7.2](../product/ALCANCE_FUNCIONAL.md#72-permisos-y-visibilidad): no inferir acceso a honorarios por responsabilidad o jefatura. Separar datos aduaneros autorizados de información comercial, costos y rentabilidad.

Cuando una fuente externa afecte decisiones, mostrar sistema, última actualización, estado de sincronización y si el dato es parcial o falló. Representar no conectada, desactualizada, parcial, error y sin permiso, sin convertir ausencia en cero ni ausencia de permiso en detalle revelado. Ofrecer reintento, detalle o indicación de dependencia sólo cuando sean reales. No mezclar datos locales y externos sin identificarlos ni inventar umbrales de frescura.

## Ayuda por capacidad

El Shell conserva su comportamiento específico en [su especificación](screens/01-foundation-application-shell.md#15-ayuda-e-inducción). La orientación futura deriva de capacidades:

- Operaciones: revisar asignadas, abrir objeto, reconocer etapa/pendientes/hito, comprender tarea/control y documentos.
- Administración: revisar listas para facturar, pendientes, gastos/rendiciones y referencias Alpha2000.
- Dirección: alertas, resumen, registros explicativos y aprobación autorizada.

Primer acceso: bienvenida breve, capacidades disponibles, orientación a Inicio/Mi trabajo y checklist; preferencias de notificación sólo cuando existan. Guías futuras, al estabilizar cada flujo: alta directa o desde cotización aceptada, segundo control, faltantes, reasignación, pase a Facturación, aprobación interna/envío/respuesta de cotización y excepción autorizada.

## Referentes investigados

Consulta oficial: 14/10/2026. Las aplicaciones ABT son propuestas de adaptación, no aprobaciones de ABT ni inspecciones de interfaces privadas. No cambian identidad, Shell ni Design System.

| Fuente | Hallazgo verificable y problema que aborda | Aplicación posible e impacto ABT | Qué no copiar | Estado |
|---|---|---|---|---|
| [SAP Fiori Worklist](https://www.sap.com/design-system/fiori-design-web/v1-136/discover/frameworks/sap-fiori-elements/list-report/worklist-sap-fiori-elements) | Lista simplificada para trabajo; esa variante de Fiori elements no usa filter bar, sí búsqueda en toolbar y opciones de tabla. Reduce complejidad de una cola. | Mi trabajo: acción y contexto claros; mantener los filtros que ABT necesita. | Restricciones del framework, layout o stack SAP. | Referencia investigada; adaptación propuesta. |
| [SAP: floorplans](https://learning.sap.com/courses/ui-development-with-sap-fiori/working-with-sap-fiori-design-guidelines_ab11c169-54de-4f51-87b9-f61c8a5198be) | List Report reúne objetos; Object Page presenta facetas de un objeto de modo responsive. Facilita pasar de encontrar a comprender. | Operaciones listado y ficha, Etapas 3–4: búsqueda → contexto → acción. | Menús SAP ni un formulario universal. | Referencia investigada; adaptación propuesta. |
| [Dynamics 365: workspaces](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/user-interface/build-workspaces) | Visión del estado de una actividad y tareas simples desde el workspace para reducir navegación. | Inicio resume; Mi trabajo contextualiza. Acciones simples sólo al definir reglas. | Tiles obligatorias, Power BI, estructura ERP o concentrar todos los procesos en Inicio. | Referencia investigada; adaptación propuesta. |
| [CargoWise Forwarding](https://www.cargowise.com/solutions/cargowise-forwarding/) | Página comercial describe hitos, documentos conectados al envío, responsables, alertas y excepciones. Atiende fragmentación de seguimiento. | Hitos, documentos, control y excepciones conectados a la Operación; Etapas 4, 7–8. | Logística global, reservas de transporte, WMS, contabilidad ni apariencia interna no inspeccionada. | Referencia comercial investigada; adaptación propuesta. |
| [CargoWise Customs](https://www.cargowise.com/solutions/cargowise-customs/) | Describe validación y conexión con autoridades para reducir errores de cumplimiento. | Explicar bloqueos y procedencia de información aduanera; integración futura conserva Alpha2000. | Reglas extranjeras, promesas de conexión a ARCA ni motor de reglas propio. | Referencia comercial investigada; no valida reglas argentinas. |
| [Magaya Platform](https://www.magaya.com/platform/) y [demo oficial documentada](https://www.magaya.com/magaya-supply-chain-video-demo/) | El texto de la demo describe convertir cotización/booking en shipment transfiriendo datos. Reduce reingreso. | Reutilizar versión aceptada en creación de Operación y conservar origen; Etapas 5 y 9. | Booking obligatorio, WMS, contabilidad paralela ni equivalencia entre aceptación y aprobación interna. | Referencias investigadas; aplicación propuesta. |
| [Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/) | Diez heurísticas generales: estado, lenguaje, control, consistencia, prevención, reconocimiento, eficiencia, minimalismo, recuperación y ayuda. | Criterios transversales anteriores; revisar tareas ABT, errores y orientación. | Tomarlas como catálogo funcional o sustituto de pruebas con usuarios. | Referencia investigada; criterio interno ya adoptado. |
| [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) | Criterios verificables para acceso: teclado, foco, contraste, nombres, mensajes y targets. | Revisar todas las rutas y overlays. El mínimo AA 2.5.8 es 24 CSS px con excepciones; 44 px es una elección del DS, no la definición de AA. | Declarar conformidad por axe o por tamaño táctil solamente. | Referencia investigada; WCAG 2.2 AA ya adoptada internamente. |

El [enlace SAP Help solicitado](https://help.sap.com/docs/SAPUI5/d625376e710e40cb9d40e43e1b02933b/c0eec49db81a441e878f528c8f3d28de.html) no devolvió contenido legible en esta consulta; no respalda hallazgos. Se contrastó con SAP Design y SAP Learning indicados arriba. No se investigó NetSuite.

## Criterios UX/UI V2

Elegir por tarea: comparación → tabla; pendientes → bandeja; objeto → ficha; secuencia → flujo; tendencia → gráfico con registros explicativos. Inicio, Mi trabajo, controles, Portal y consultas no se convierten automáticamente a DataTable. Clientes/Cotizaciones usan tablas proporcionadas; Operaciones conserva DataTable y Administración bandeja tabular.

Identidad y apertura no ocultables; selección sólo con acción útil; columnas opcionales no habilitan datos restringidos. Limpiar filtros conserva contexto de tipo y restablecer vista recupera presentación. Orden/agrupación/página y retorno son coherentes en URL. Fechas declaran evento y rango; actualización no es arribo, factura ni cobro.

Suprimir descripciones obvias y avisos reiterados en todas las superficies. Identificar el entorno globalmente, reservando aclaraciones para acciones sensibles, consecuencias, bloqueos y errores. Ayuda/inducción en menú secundario con progreso recuperable. Chevron expande, indicador de orden ordena y navegación interna usa icono interno. Responsive se verifica dentro del Shell con acciones visibles y encabezados sin colisión, no sólo por ausencia de overflow.

## Continuidad y composición V3

Formularios en diálogo: el popup compartido limita altura al viewport dinámico menos el padding existente (2rem), con scroll interno. Título y acciones deben ser alcanzables en móvil/zoom, sin recorte superior. Comprobar con contenido extenso y teclado; no asumirlo por ausencia de overflow global.

- Listados: búsqueda y filtro frecuente visibles; secundarios plegados, filtros activos removibles y una confirmación para rangos compuestos. No repetir el tipo fijado por una vista.
- Actualizaciones locales de filtros/agrupación conservan foco y scroll mediante History API integrada con Next; URL conserva la consulta y Atrás/Adelante restaura el estado. Enlaces de detalle capturan origen/posición; retorno local restaura foco en el registro y posición, sin depender de back ambiguo.
- Fecha de período siempre identifica evento: Actualización no equivale a arribo/oficialización/vencimiento.
- Selector buscable compartido para catálogos potencialmente extensos: etiqueta persistente, consulta tolerante a acentos, opciones identificables, flechas/Inicio/Fin/Enter/Escape/Tab, selección conservada sin coincidencias. No crear registros ni ampliar capacidades desde el componente.
- Sidebar claro usa accent/accent-foreground ABT; hover/activo/foco mantienen señales y contraste. Superficie de trabajo card sobre lienzo muted. DS y producto comparten tokens; no tipografías ni colores nuevos.

### Personas y capacidades V3

Acceso convencional visual en /acceso; escenarios ficticios en entrada secundaria /acceso/escenarios, sin presentar elección de rol como seguridad. Contraseña mostrar/ocultar con nombre accesible y estado pulsado, sin almacenamiento; recuperación informa ausencia de envío/cambio efectivo. El menú de usuario conserva inducción. Las capacidades son diferentes de área/cargo y de preferencias de columnas; filtrar poblaciones antes de conteos, gráficos y drill-down. Comportamiento particular y reinicio: [Personas](screens/v3-personas-acceso.md).

### Colecciones y preparación administrativa V3

Búsqueda local al escribir reemplaza la URL sin crear una entrada de historial por carácter; filtros discretos y página generan navegación recuperable. Retorno explícito conserva contexto/foco; no recargar documento ni desplazar arriba al filtrar. Paginación identifica página/total y se reinicia al cambiar filtros. En móvil el buscador ocupa ancho útil; ausencia de overflow no demuestra legibilidad. Tabla amplia y lista compacta pueden compartir exactamente la misma población/página.

Importes completos conservan centavos y moneda; no sumas/conversiones implícitas. Dimensiones de gráficos usan ID estable y etiqueta humana, con compatibilidad de enlaces anteriores cuando sea posible. Renombrar catálogo no cambia la denominación histórica guardada en el registro. Preparación local y referencia externa por verificar no se muestran como contabilización, pago o conexión confirmados. Contrato particular: [Administración V3](screens/10-administracion-finanzas.md#v3-04--preparación-administrativa-local).
