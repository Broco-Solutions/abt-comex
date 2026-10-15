# Frontend Decisions

## 2026-10-15 — Administración organizada por trabajo

Decisión interna aprobada: Bandeja administrativa, Gastos y rendiciones,
Ingresos y egresos, Comprobantes y cuentas. Cuatro áreas con subconsultas
pertinentes, selector compacto móvil y rutas históricas compatibles.
Categorías/conceptos en Configuración con acceso contextual autorizado. G2/G3
siguen en gastos/vencimientos; Dirección concentra análisis transversal. La
registración de un gasto no acredita pago ni contabilidad externa.

## 2026-10-15 — Uso autorizado de la nómina laboral relevada

Decisión interna explícita del responsable: usar nombres y correos laborales
relevados para representar el equipo incluso en evaluación pública. No incluye
secretos, datos bancarios, remuneraciones ni información personal ajena al
trabajo. La nómina y los escenarios de capacidad son fuentes separadas; conocer
un área o nombre no acredita acceso, permisos ni trabajo asignado. Autoridad
vigente y fuentes: [Personas](screens/v3-personas-acceso.md).

## 2026-10-15 — V3: relación Clientes/Cotizaciones y navegación de organizaciones

Clientes es la entrada primaria al maestro de clientes y Cotizaciones queda como
subopción directa del mismo dominio comercial. Cotizaciones mantiene la ruta
`/cotizaciones` y sus enlaces existentes; la ficha de Cliente conserva el acceso
filtrado y la creación contextual. Proveedores permanece como destino primario
independiente y diferencia localmente proveedores de ABT y contrapartes
operativas. No se repiten los tres accesos en ambas páginas: una organización
puede mantener múltiples roles y sus relaciones siguen disponibles en fichas y
operaciones.

## 2026-10-15 — V3: profundidad visual del Application Shell

El refinamiento posterior usa una superficie ABT verde profunda (`#103e29` a
`#0a2e1e`), iluminación superior discreta, acento `#1c6040`, bordes translúcidos
y estados activos/foco basados en contraste.
El wordmark/isotipo oficial ABT se presenta en blanco mediante el asset
institucional existente; Broco continúa como atribución secundaria en el pie.
La misma variante se inspecciona en sidebar expandido, rail compacto y drawer.

Decisión interna del encargo: agrupar Operación diaria, Registros y Gestión;
mantener Configuración/cuenta al pie y unificar allí el menú antes presente en
header. Padres navegables con chevron separado, apertura independiente en
sessionStorage y rail con destinos secundarios accesibles por foco. El botón
de modo queda junto al branding. No hay flechas decorativas en seleccionados.
Mi perfil consulta la identidad propia cuando fue elegida explícitamente; los
escenarios muestran su condición de evaluación. No habilita edición laboral ni
infiere capacidades. El contador deriva del trabajo visible y las asignaciones
explícitas. Broco usa assets negativos oficiales ya disponibles en el workspace.

## 2026-10-15 — V3-05: preparación, aplicaciones y saldo al corte

Decisión interna de experiencia conforme a aprobación V3, no definición contable ABT: documentos preparados se excluyen de análisis/cartera hasta identificarlos explícitamente como referencias sintéticas de evaluación. Aplicaciones parciales relacionan fondos/créditos con obligaciones en la misma moneda y contraparte; ninguna escribe externamente. Saldo informado de origen y saldo del escenario son distintos. La cartera no hereda el filtro de emisión del análisis de flujos: incluye obligaciones anteriores abiertas. Contrato, pendientes y pruebas en [Administración](screens/10-administracion-finanzas.md#v3-05--comprobantes-aplicaciones-y-carteras).

## 2026-09-28 — Arquitectura

ABT Comex se desarrolla como monorepo de producto con Turborepo y pnpm.

La aplicación web vive en `apps/web`.

El Design System compartido vive en `packages/ui`.

Backend, persistencia y contratos compartidos se incorporarán únicamente cuando se defina su arquitectura real.

## 2026-09-28 — UI foundation

shadcn/ui con Base UI.

Preset inicial: Rhea.

Iconografía: Lucide.

El preset es solamente un punto de partida. Los tokens y componentes finales pertenecen al Design System de ABT.

## 2026-09-28 — Dirección visual

Enterprise B2B.

La interfaz debe ser:

- sobria;
- profesional;
- operativa;
- consistente;
- densa pero legible;
- accesible.

## 2026-09-28 — Accesibilidad

WCAG 2.2 AA es el estándar mínimo.

## 2026-09-28 — Gobierno técnico

Skills, agentes y revisores especializados se usan sólo cuando agregan valor real.

No se ejecutan auditorías o análisis profundos para cambios rutinarios.

## 2026-10-08 — Alcance y frontend como fuentes separadas

`docs/product/ALCANCE_FUNCIONAL.md` define qué producto se construye.

`docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md` define cómo el alcance se expresa en navegación, pantallas, acciones y estados.

Las decisiones funcionales relevantes no pueden quedar sólo en prompts o código.

## 2026-10-08 — Especificación por pantalla

Cada pantalla o flujo relevante tendrá una especificación en `docs/frontend/screens/` antes de considerarse listo para implementación.

La especificación utiliza `SCREEN_TEMPLATE.md` y debe incluir propósito, acciones, estados, permisos, responsive, ayuda y pruebas.

## 2026-10-08 — Gobierno de Codex

Codex trabaja según `CODEX_RUNBOOK.md` y `PLAN_IMPLEMENTACION.md`.

Una ejecución larga puede cubrir una etapa coherente y verificable, pero no varias etapas de producto en un solo lote.

Cada etapa termina con gate de revisión humana.

Codex no hace commit ni push salvo pedido explícito.

## 2026-10-08 — Estrategia de pruebas

El frontend utilizará:

- Vitest para lógica y pruebas rápidas;
- Testing Library y User Event para componentes;
- axe para apoyo de accesibilidad;
- Playwright para recorridos E2E y regresión visual selectiva.

Las versiones concretas se elegirán según compatibilidad con Next.js y React existentes.

La cobertura es basada en riesgo; no se fija un porcentaje global arbitrario.

## 2026-10-08 — Revisión visual

La revisión visual principal es humana, en localhost o preview.

`agent-browser` no es requisito normal.

Playwright queda versionado en el repositorio para recorridos y snapshots repetibles.

## 2026-10-08 — Arquitectura de features y fixtures

La lógica y composición de producto viven en `apps/web/features`.

Los componentes genéricos viven en `packages/ui`.

Mientras no exista backend, cada feature mantiene fixtures determinísticos detrás de una frontera simple de lectura. No se crea una API ficticia ni repositorios genéricos prematuros.

## 2026-10-08 — Estado relevante en URL

Búsqueda, filtros, período, agrupación, ordenamiento y paginación deben reflejarse en URL cuando permitan compartir vistas, volver sin perder contexto o navegar desde indicadores.

## 2026-10-08 — Onboarding desde el inicio

La infraestructura de inducción y ayuda se diseña desde el Application Shell.

No se construye un tour completo antes de que los flujos estén estables.

La inducción es no bloqueante, retomable y dependiente de capacidades, no de una selección manual de rol.

## 2026-10-08 — Branding

ABT Comex es la marca principal.

Broco Solutions aparece como atribución secundaria mediante `BrandAttribution` y la fórmula “Powered by Broco Solutions”.

El enlace oficial será `https://brocosolutions.com`.

Se usan únicamente assets oficiales almacenados en `assets/brand/`. La atribución se ubica en el pie del sidebar/drawer o footer de superficies externas, sin competir con ABT.

## 2026-10-08 — Etapa inicial de implementación

La próxima etapa es `Frontend Foundation`.

Incluye gobierno, configuración de pruebas, estructura mínima, CI, asset oficial de Broco, componente de atribución y especificación del Application Shell.

No incluye todavía Application Shell ni pantallas de producto.

Esta decisión registra el punto de partida histórico. Etapas 0 y 1 fueron
completadas y fusionadas posteriormente; la decisión vigente de secuencia se
registra el 10/10/2026.

## 2026-10-09 — Infraestructura de pruebas de frontend

Las pruebas rápidas se ejecutan por workspace con Vitest: jsdom para componentes de `web` y Node para lógica pura de `packages/ui`. Playwright usa Chromium, Firefox y WebKit localmente; CI ejecuta el smoke en Chromium y conserva la matriz local para futuros flujos críticos. El snapshot visual inicial se limita al encabezado de `/design-system`. El contraste se valida manualmente cuando axe corre en jsdom.

## 2026-10-09 — Inicio y Mi trabajo como destinos separados

Inicio y Mi trabajo son destinos principales distintos y consecutivos en la
navegación. Inicio sintetiza qué está pasando y qué requiere atención; Mi
trabajo concentra la ejecución completa de tareas, revisiones, aprobaciones,
controles y excepciones.

Inicio podrá mostrar una vista resumida con acceso a registros concretos y la
acción “Ver todo en Mi trabajo”. Mi trabajo permanece en `/mi-trabajo` y no
será un submenú ni una ruta anidada de Inicio. Una separación visual sutil
distingue estos dos destinos personales de los dominios del negocio.

## 2026-10-09 — Jerarquía de Operaciones y estados de navegación

Operaciones es el enlace principal a la vista completa en `/operaciones`. No
existe un ítem redundante “Todas”. Importaciones y Exportaciones son vistas
filtradas del mismo dominio mediante `?tipo=importacion` y
`?tipo=exportacion`.

En la vista completa, Operaciones es el único destino seleccionado. En una
vista filtrada, Operaciones comunica sección activa y sólo el hijo
correspondiente comunica destino seleccionado y expone `aria-current="page"`.
Padre activo y destino seleccionado no usan representaciones visualmente
equivalentes.

La navegación principal no utiliza bajo contraste para comunicar inactividad:
un destino inactivo debe percibirse disponible y diferenciarse de un futuro
estado disabled. Peso, indentación, espaciado, fondo, indicador e iconografía
complementan al color para expresar la jerarquía.

## 2026-10-09 — Sidebar adaptable e isotipo oficial ABT

En desktop y notebook (desde 1024 px) la sidebar inicia expandida y puede
contraerse manualmente a un rail permanente de 4.5rem (72 px), sin resize
libre. La preferencia `expanded`/`compact` se guarda temporalmente en
`localStorage` detrás del provider del shell. Tablet y mobile usan siempre el
drawer completo y nunca convierten esa preferencia en rail.

El modo compacto conserva la misma fuente de navegación, targets de 44 × 44
px, nombres accesibles, tooltips en hover/foco e indicadores de estado.
Operaciones sigue enlazando a `/operaciones` y expone un flyout accesible para
Importaciones y Exportaciones; Escape lo cierra y devuelve el foco al enlace.

El wordmark completo se usa en modo expandido. El modo compacto usa el globo
oficial extraído mediante recorte lossless y común desde los logos maestros,
en variantes verde y blanca. No se recorta el wordmark dinámicamente con CSS,
no se recolorea el derivado y la variante blanca queda reservada para fondos
oscuros. Si se obtiene el vector oficial, reemplazará al raster sin cambiar
este patrón de uso.

## 2026-10-09 — Atribución Broco por modo de navegación

ABT y Broco comparten el patrón de navegación: marca completa en expandida y
drawer; isotipo en rail compacto. La atribución Broco expandida usa el texto
visible `Powered by` junto con `BROCO_SOLUTIONS_logo_gradient.svg`; no repite
`Broco Solutions` fuera del logo. El rail compacto usa exclusivamente
`BROCO_SOLUTIONS_isotype_gradient.svg`, sin texto visible, con tooltip y nombre
accesible `Powered by Broco Solutions`.

## 2026-10-09 — Onboarding global con panel contextual en Inicio

El estado y el progreso de la inducción pertenecen al Application Shell y se
mantienen globales, con persistencia local temporal. Su panel completo se
muestra exclusivamente en `/inicio`; ningún otro módulo reserva altura ni
monta una copia del panel.

Ayuda permanece disponible en todas las rutas para consultar el progreso,
reiniciar o retomar. Retomar desde otro módulo navega declarativamente a
`/inicio` y conserva el avance existente. La inducción puede omitirse o
completarse, nunca bloquea la navegación, no redirige accesos directos y se
desmonta sin dejar espacio residual.

## 2026-10-10 — Cierre de Etapas 0 y 1 y próximo bloque previsto

Etapas 0 y 1 están completas con limitación de entorno para la ejecución local
concluyente de Firefox y WebKit. Fueron aprobadas y fusionadas en `main` sin que
esa limitación constituya un fallo comprobado del producto.

El próximo bloque previsto es Etapa 2 — Inicio y Mi trabajo. Su especificación
combinada vive en `screens/02-inicio-mi-trabajo.md` porque ambas experiencias
usan la misma fuente conceptual: Inicio resume y deriva; Mi trabajo permite
operar. Las rutas `/inicio` y `/mi-trabajo` siguen separadas y ya fueron
aprobadas como parte del Application Shell.

La preparación documental permite una futura implementación con fixtures
determinísticos y reemplazables. No aprueba perfiles, prioridades, SLA,
asignaciones, datos sensibles ni contratos de integración definitivos.

## 2026-10-14 — Consolidación documental y trazabilidad

**Tipo:** decisión interna de gobierno documental, ejecutada por pedido del responsable del repositorio; revisión humana del resultado pendiente. No es aprobación formal de alcance por Dirección ABT.

**Diagnóstico:** especificación general (751 líneas), plan (815), AGENTS (168), runbook (321), README de pantallas (144) y plantilla (260) repetían lectura, patrones, estados, Ready/Done y procedimientos. El README raíz seguía describiendo un template. El inventario de pantallas llamaba Draft a documentos inexistentes; el Shell mezclaba estado de etapa con estado de especificación. La matriz tenía citas de secciones desalineadas, IDs semánticamente incorrectos y una explicación aritmética incompatible con su conteo real.

**Decisión vigente:** la [tabla de autoridad del runbook](CODEX_RUNBOOK.md#autoridad-y-responsabilidades) gobierna responsabilidades y momentos de actualización. La especificación general pasa a índice de compatibilidad. La decisión del 08/10 que le asignaba navegación, pantallas y estados queda sucedida por mapa + estándar + especificaciones. Se conserva íntegro su texto histórico.

### Inventario y destino de consolidación

Las referencias entrantes/salientes efectivas se inspeccionan con `node scripts/check-docs.mjs --inventory`; la tabla del runbook explica el vínculo de autoridad. Evaluación de cada documento del corpus:

| Documento | Información exclusiva preservada / acción | Duplicación retirada o motivo de separación |
|---|---|---|
| AGENTS | Identidad, fuentes, límites, entrada y advertencia Next.js | Procedimientos y checklist de entrega al runbook; lectura proporcional. |
| README raíz | Navegación del proyecto y ejecución local | Se retira descripción genérica de template; sin reglas duplicadas. |
| Alcance | Capacidades, reglas y exclusiones; sin modificación | Autoridad funcional; no se fusiona con experiencia ni roadmap. |
| Especificación general | Índice compatible con ruta anterior | Contenido distribuido según tabla de migración inferior; no se elimina archivo. |
| Estándar | UX transversal, patrones, sensibilidad/frescura, referentes | Absorbe contenido exclusivo de experiencia; delega arquitectura, marca, Ready/Done y pruebas a sus autoridades. |
| Matriz | Todos los IDs, necesidades, reglas y pendientes | Registro de evidencia y semántica propios; no sustituye mapa ni aprueba negocio. |
| Mapa | 32 experiencias, rutas y 10 recorridos | Estados/heurísticas genéricos pasan al estándar; enlace a especificaciones/pruebas. |
| Plan | Etapas 0–13, objetivos, dependencias, entregables, gates y cierres | Setup 0/1 pasa a evidencia histórica referenciada; procedimientos al runbook. |
| Runbook | Procedimiento, mantenimiento, Ready/Done, PR e informe | Autoridad única del trabajo; deja de copiar arquitectura/marca/pruebas. |
| Decisiones | Historia original completa, más esta migración | No se borra historia aprobada ni se confunde con norma vigente. |
| Test strategy | Estrategia por riesgo, comandos y evidencia | Se corrige tiempo verbal del setup cerrado; agrega validación documental diferenciada. |
| Brand usage | Assets, atribución y reglas de marca; sin cambios | Especializada y estable; evita replicación en estándares/procedimiento. |
| README pantallas | Índice de archivos reales y estados de especificación | Inventario futuro al mapa; Ready/Done al runbook. |
| Plantilla | Núcleo proporcional y trazabilidad; ampliación por riesgo | No obliga 24 secciones ni repite checklist transversal. |
| Shell | Comportamiento aprobado y evidencia histórica | Estado de especificación Approved; limitación de etapa en plan; citas migradas. |
| Inicio/Mi trabajo | Necesidades, escenarios, límites y preguntas del corte | Corrige fuentes, navegación temporal y acciones futuras; permanece Draft. |
| Arquitectura | Fronteras actuales y evolución diferida | Absorbe organización de features/fixtures; no introduce backend ni motor de reglas. |

### Migración desde la especificación general anterior

Se comprobó el destino antes de retirar el texto. Los números refieren a la versión presente al iniciar esta consolidación, no a secciones actuales.

| Origen anterior | Destino vigente / preservación |
|---|---|
| §§1–2 propósito y gobierno | Índice frontend y runbook (autoridad, lectura, mantenimiento). |
| §§3–4 visión y diez heurísticas | Estándar: Visión y usabilidad. |
| §5 arquitectura de información | Mapa: navegación, rutas, capacidades contextuales y canales. |
| §6 Application Shell | Especificación 01 §§5, 8, 13–17 y 23; estándar de navegación; marca. Los nombres de componentes previstos no se convierten en entregables implementados. |
| §7 patrones | Estándar: Catálogo de patrones; mapa: experiencias/recorridos. Alta directa/desde aceptada en J1 y Etapa 5. Estados administrativos en matriz FIN-009 y alcance §6. |
| §8 onboarding | Shell §15 para comportamiento existente; estándar: Ayuda por capacidad y guías futuras. |
| §§9–11 estados, permisos, integraciones | Estándar: Estados transversales y Permisos, fuentes y frescura. |
| §§12–13 responsive/accesibilidad/marca | Estándar, estrategia de pruebas y BRAND_USAGE. |
| §14 features/mocks | Arquitectura: Frontend y frontera de datos. |
| §15 inventario | Mapa: experiencias y recorridos; no se agrega cada subvista como pantalla independiente. |
| §16 especificación por pantalla | README de pantallas y plantilla proporcional. |
| §§17–18 calidad/aceptación | Estrategia de pruebas, runbook Ready/Done y criterios particulares de pantalla. |
| §19 pendientes | Alcance §11, vacíos de matriz, gates del plan y pendientes del Shell/Etapa 2. |
| §20 próximo corte | Plan y especificación 02 Draft. |

No se retiró un documento completo ni se renombraron rutas documentales. Citas activas con números antiguos se reemplazaron por autoridades específicas; las decisiones históricas mantienen sus referencias como historia, con esta nota de sucesión. La reducción de líneas no es objetivo ni medida de cobertura.

### Contraste funcional y semántico

- Antes/después: 108 necesidades + 9 registros Alpha2000 = 117 IDs; 32 experiencias y 10 recorridos. Se preservan también los 18 bloques REP y las categorías de certeza, aclarando que BASE DOCUMENTADA no significa aprobación formal.
- Se corrigió la aritmética previa “90 más 30” sin eliminar o agregar IDs.
- E1:OPS-010 respalda extracostos/excepciones. El doble control cita pestaña Operación, Controles de Impo/Expo y Reglas transversales confirmadas.
- E1:DIR-010 respalda permisos ampliados de Dirección; cobranzas cita E1:DIR-007, pagos/costos E1:DIR-008 y tesorería las secciones narrativas y E6. REP-003 ya no atribuye concentración a pagos/costos; REP-012 ya no atribuye compras a cobranzas.
- E1:OPS-011 es protocolos y E1:OPS-012 es seguimiento autónomo; DJVE y pase/facturación citan sus secciones narrativas. Se repararon también las secciones de L1 y se retiraron citas normativas a L2 ahora índice.
- Miro se consultó parcialmente por Codex el 14/10; la lectura previa por otra sesión queda diferenciada. Se preservan notas AS IS de validación parcial y TO BE propuesto, sin elevarlas a aprobación formal.
- Se localizaron los seis originales de Importación y siete de Exportación. El detalle del grado de inspección está en E15/E16 de la matriz; XLS antiguos e interpretación integral siguen pendientes.
- Se preservan dos caminos de apertura; DJVE previa autónoma y relaciones múltiples/opcionales; custodia física/digital diferenciada; facturación, cobranza, cumplido, post-embarque y cierre documental separados.
- Referentes oficiales investigados y límites están en el estándar; no constituyen módulos nuevos, reglas regulatorias argentinas ni un rediseño del DS.
- Etapa 2 sólo prepara lectura, filtros y contexto útil. No presenta placeholders como fichas ni simula aprobación/oficialización. Continúa Draft.
- Etapas 0/1 mantienen estado y evidencia de cierre del 10/10; no se atribuye nueva ejecución Firefox/WebKit.

### Mantenimiento y límites de esta entrega

El runbook incorpora antes/durante/después, contenido de PR, registro de fuente/validación y necesidad de sincronizar Drive ante cambios de alcance. En esta entrega **no se cambió el alcance ni se escribió en Drive/Miro**; la fecha histórica de sincronización permanece intacta.

Se incorpora un único archivo nuevo de herramienta: [scripts/check-docs.mjs](../../scripts/check-docs.mjs). Justificación: las verificaciones repetibles necesitan código ejecutable; ningún documento existente puede detectar automáticamente referencias rotas. Sin dependencias, infraestructura adicional ni cambios funcionales de la aplicación. Comprobación estructural separada de revisión semántica.

Pendientes: validación humana del paquete, catálogo/prioridad/capacidades de trabajo, ID y cardinalidades, reglas por proceso, criterio de pase, Alpha2000 campo a campo, transición COMEX360, fórmulas/fuentes de Dirección, interpretación de XLS y elementos omitidos de Miro. Las definiciones externas no se cierran por consolidar documentación.

### Evidencia de verificación de esta consolidación

Base de comparación: archivos presentes al inicio del 14/10/2026, incluidos los siete con trabajo documental sin commit. Corpus: AGENTS + README raíz + todos los Markdown de docs, 17 documentos y 5637 líneas iniciales (conteo de saltos de línea, como wc -l). No se eliminó ni añadió un documento al corpus; se agregó únicamente el script descrito arriba.

El contraste de las 117 filas conserva literalmente dominio, necesidad, regla, validación pendiente y etapa prevista. Cambian fuentes, localizadores, vínculos UI, aclaración de certeza y dependencias técnicas no decididas. Se conservan los conjuntos de IDs y los 32 miembros de la clasificación UI, 10 recorridos y todo el texto previo de DECISIONS.

Checks: sintaxis Node, self-test del validador, corpus con baseline, inventario de enlaces y git diff --check satisfactorios. Sin cambios en aplicación, paquetes, assets o dependencias; no correspondió ejecutar pruebas de frontend ni afirmar revisión visual. HEAD y main permanecen en f76b0fc; rama docs/master-frontend-plan, sin commit/push/merge. Resultado pendiente de revisión humana, no etapa de producto completada.

## 2026-10-14 — Confidencialidad económica y ejecución integral planificada

**Tipo y origen:** decisiones internas por instrucción expresa del responsable del proyecto, «Ajuste final del Plan Maestro y preparación de ejecución integral», en esta sesión. No constituyen aprobación formal de ABT, contratos disponibles ni autorización de producción. Resultado documental para revisión humana; no implementación en esta sesión.

- **Confidencialidad:** se formaliza en [alcance §7.2](../product/ALCANCE_FUNCIONAL.md#72-permisos-y-visibilidad) la separación de seis categorías y la ausencia de acceso automático a honorarios por responsabilidad operativa o jefatura. Se corrige el entregable genérico «totales por moneda» del listado de Operaciones. Capacidades definitivas pendientes de ABT; Google Doc funcional pendiente de sincronizar en §7.2, sin alterar su fecha histórica de sincronización.
- **Primera pasada integral:** se mantiene construir todas las Etapas 2–13; orden recomendado 2 → 3 → 4 → 6 → 9 → 5 → 7 → 8 → 10 → 11 → 12 → 13. Clientes y Cotizaciones preceden al alta para reutilizar sus datos y conservar apertura directa. IDs, alcance y aprobación histórica 0/1 se preservan.
- **Gobierno de ejecución:** para esta primera pasada, se sustituye la instrucción histórica de detenerse para revisión visual humana después de cada etapa. Se permiten sesiones extensas sucesivas con gates técnicos/documentales por bloque, preparación técnica registrada y estados `Under review` hasta revisión humana integral. La historia anterior se conserva como tal; el procedimiento vigente está en el runbook. No se autoriza inventar reglas ni atravesar decisiones funcionales bloqueantes.
- **Integraciones:** seguimiento técnico transversal en el plan, sin etapa numerada ni nuevo maestro; necesidades/evidencia siguen en la matriz. Se separan Alpha2000 aduanero y administrativo, Interbanking sólo lectura, ARCA/MOA, COMEX360 y M365. Consulta de E5 en sólo lectura: guía y encabezados, sin filas de relevamiento; ninguno de los seis frentes tiene disponibilidad/API confirmada o integración validada por este trabajo.
- **Líneas de producto:** frontend demostrativo y producto operativo real tienen evidencias diferentes. Definición técnica puede avanzar en paralelo a pantallas; implementación real depende de arquitectura, autorización y seguridad. Completar frontend no acredita producción ni concede permiso para commit, push, merge o deploy.

Autoridades vigentes: [plan](PLAN_IMPLEMENTACION.md), [runbook](CODEX_RUNBOOK.md), [estrategia de pruebas](TEST_STRATEGY.md), [arquitectura de fixtures](../architecture/README.md). Matriz, mapa, estándar e Inicio/Mi trabajo enlazan la política económica; no crean roles nuevos. Inicio/Mi trabajo sigue Draft y todas las Etapas 2–13 siguen pendientes. Drive y Miro no se modificaron.

## 2026-10-14 — Estrategia prioritaria de integraciones y exclusión de COMEX360

**Origen y autoridad:** instrucción expresa del responsable del proyecto, «Ajuste final de estrategia de integraciones y exclusión definitiva de COMEX360»; decisiones internas aprobadas para planificación. No equivalen a validación formal de ABT, acuerdo del proveedor ni autorización de acceso a datos reales. E17 de la matriz registra el aporte; revisión humana del ajuste documental pendiente.

1. Alpha2000 es la integración prioritaria, con frentes operativo/aduanero y administrativo/contable separados. Conserva preparación/oficialización y funciones contables actuales. La reunión inicial y posibilidad de endpoints específicos fueron **informadas por el responsable**, no presenciadas ni comprobadas técnicamente por Codex; fecha/acta pendientes. Factibilidad preliminar no equivale a API disponible, contrato ni pruebas realizadas.
2. MOA se evalúa primero mediante Alpha2000; ARCA directo es alternativa condicionada a falta de cobertura o justificación suficiente. No planificar dos conectores obligatorios para el mismo dato. Fuente original e intermediario se identifican por separado. Caso prioritario: cumplido de Exportación, sin inventar estados regulatorios ni confundirlo con post-embarque/cierre.
3. Interbanking permanece en evaluación de sólo lectura, sin capacidades bancarias de escritura u operaciones ECheqs comprometidas. Las necesidades informativas de Dirección no acreditan disponibilidad del proveedor.
4. Microsoft 365 sigue previsto para correo/colaboración documental, con alcance funcional/técnico pendiente; sin automatizaciones nuevas ni reemplazo por Google Workspace.
5. COMEX360 queda excluido del sistema futuro, sin integración, módulo, pantalla, servicio, adaptador, sincronización o dependencia. Tampoco migración automática/integral o importación permanente. Sólo una decisión futura separada podría evaluar extracción puntual de información indispensable, exclusiva y no recuperable por otras fuentes, acreditada por ABT; no incluida ahora.

**Sustitución explícita:** las referencias a transición/migración o integración objetivo COMEX360 en las entradas históricas de consolidación y ejecución integral anteriores quedan superadas por esta decisión. Se conservan intactas como historia, no instrucciones vigentes. Las fuentes originales y los problemas de doble carga no se borran.

**Trazabilidad preservada:** INT-002 se reclasifica hacia continuidad del negocio con capacidades propias, enlazando documentos, operación, gastos y actividad existentes; no se elimina ni reutiliza para otro sistema. ALP-008 mantiene evidencia histórica y retira dependencia futura del legado. J10 conserva su ID y pasa a procedencia/continuidad de información. REP-009 conserva la necesidad histórica sobre ECheqs sin comprometer un conector o acciones bancarias. Se mantienen los 117 IDs, 32 experiencias y 10 recorridos.

**Evidencia y límites:** E18 registra la consulta focalizada de documentación pública ARCA; E19 la ficha pública de Alpha Comex Movil. Hallazgos, limitaciones de vigencia/acceso y preguntas priorizadas para Leandro están en el [plan](PLAN_IMPLEMENTACION.md#evidencia-alpha2000-y-vías-para-moa), no se duplican aquí. No se contactó al proveedor, generó certificado, solicitó/almacenó secreto ni probó destinación real.

Autoridad de inclusión/exclusión: [alcance §8](../product/ALCANCE_FUNCIONAL.md#8-sistemas-externos-y-fuentes-de-verdad); arquitectura técnica consume esa decisión, matriz conserva evidencia y plan gobierna seguimiento. Sincronización posterior del Google Doc funcional pendiente en §§3, 8, 10 y 11, además de §7.2 previamente pendiente. No se modificaron Drive ni Miro; cualquier adecuación de TO BE externos requiere una sesión autorizada.

Sin cambios a confidencialidad económica, secuencia integral 2 → 3 → 4 → 6 → 9 → 5 → 7 → 8 → 10 → 11 → 12 → 13, cierres históricos 0/1 ni gates técnicos/documentales. Etapa 2 permanece sin implementar y su especificación Draft. Los contratos externos pendientes no bloquean fixtures sintéticos coherentes y explícitamente demostrativos.

## 2026-10-14 — UX/UI V2 autorizada internamente

El responsable autoriza UX-01–UX-07, PR y squash con gates verdes y revisión humana final. Seguimiento y V01–V21 en [plan](PLAN_IMPLEMENTACION.md#iteración-uxui-v2); criterios en [estándar](FRONTEND_STANDARD.md#criterios-uxui-v2). Se aprueban internamente acceso demostrativo /acceso, presets sintéticos de capacidades, ayuda secundaria y redefinir Gestión como Dirección conservando /gestion, sólo junto al contenido analítico G1–G5. No son roles ni reglas financieras aprobadas por ABT. Alcance exclusivamente frontend.

## 2026-10-15 — Coherencia del reinicio y referencias V2

Decisión técnica UX dentro de la ejecución autorizada: concentrar el reinicio en el menú global para no dejar referencias huérfanas entre cotizaciones/versiones y operaciones temporales. Conserva confirmación ante cambios e inducción independiente; comportamiento en [Cotizaciones](screens/09-cotizaciones.md#ux-06--consulta-de-versiones-y-formulario). Referencias visuales del Shell actualizadas tras inspección técnica, no aprobación humana. Evidencia y límites del cierre en el [plan](PLAN_IMPLEMENTACION.md#regresión-transversal-ux-07).

## 2026-10-15 — V3: evolución integral de producto/frontend

Decisión interna del responsable: ejecutar V3-01 a V3-07 según el [plan](PLAN_IMPLEMENTACION.md#v3--evolución-integral-autorizada-internamente-15102026), con revisión técnica por incremento y aceptación humana integral pendiente. No aprobación formal ABT. Precisión funcional y exclusiones vigentes en [alcance V3](../product/ALCANCE_FUNCIONAL.md#evolución-v3--aprobación-interna-15102026).

Decisión visual reversible V3-01: sidebar verde claro mediante el token accent existente y contenido sobre card; no nueva paleta ni identidad. Se prefiere sólido antes que degradado para mantener contraste y sobriedad. Filtros simples inmediatos, búsqueda confirmada y período avanzado agrupado; URL recuperable, sin recarga de documento. El combobox compartido se demuestra primero en DS y se aplica a Clientes en Cotización, no a selectores pequeños por inercia.

## 2026-10-15 — V3-02: identidad común y roles contextuales

Implementación demostrativa de ORG-001 y ORG-002 conforme a [alcance V3](../product/ALCANCE_FUNCIONAL.md#evolución-v3--aprobación-interna-15102026). Proveedores de ABT y contrapartes de operaciones tienen vistas diferenciadas; un rol no genera deuda ni equivale a una obligación. Roles activos independientes; historial preservado. Se conserva Clientes como término del menú y se agrega Proveedores localizable, con enlaces hermanos al maestro compartido. Identidad fiscal y fuente externa pendientes, no validadas por esta decisión UX.

El formulario permite preparación local con nombre/rol; identificación requiere país para contextualizar coincidencias. No impone validación fiscal ni fusiona automáticamente. Creación contextual mediante diálogo preserva borradores; selección buscable reutiliza DS. Revisión humana/ABT pendiente.

## 2026-10-15 — V3-03: acceso convencional y administración de evaluación

USR-001, USR-002 y ACC-001 se implementan conforme al alcance aprobado internamente, no como política de roles de ABT. [Personas y acceso](screens/v3-personas-acceso.md) registra comportamiento, sensibilidad y pendientes. Área, función o equipo no conceden capacidades. Los presets requieren acción explícita; capacidades económicas se separan antes de proyectar gráficos y registros. Contraseñas efímeras, sin almacenamiento, verificación, invitación ni recuperación externas.

Para poder evaluar nuevos usuarios y suspensiones, cambiar identidad conserva la configuración local de personas/equipos y reinicia transacciones; Salir o Reiniciar restaura ambos conjuntos. Inducción independiente preservada. Esta excepción acotada al nuevo catálogo es reversible y no persistencia productiva. La suspensión transfiere asignaciones actuales, no actores históricos; responsables/suplentes se revisan explícitamente.

## 2026-10-15 — V3-04: preparación administrativa y proyecciones compartidas

Se implementa la dirección interna de CAT-001/MOV-001 con contratos frontend reversibles en la [especificación administrativa](screens/10-administracion-finanzas.md#v3-04--preparación-administrativa-local), no reglas contables aprobadas por ABT. Fuente mutable única para gastos/movimientos/rendiciones; semillas previas preservadas como historia de fixtures. Gráficos y registros consumen esa proyección, monedas separadas y centavos preservados. Roles de organización no generan obligaciones.

Catálogo plano y concepto libre por registro, sin subcategorías/centros de costo especulativos. Denominación histórica conservada; cambiar el uso de una categoría referenciada exige otra categoría, no reclasificación silenciosa. Referencias externas por verificar no equivalen a integración. Registrar una referencia de evidencia no certifica archivo, pago, aprobación ni contabilización. Revisión humana y definiciones ABT/Alpha pendientes.
