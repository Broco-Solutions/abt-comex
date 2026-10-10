# Frontend Decisions

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
