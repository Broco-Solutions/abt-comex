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