# Frontend Decisions

## 2026-09-28 — Arquitectura

ABT Comex se desarrolla como monorepo de producto con Turborepo y pnpm.

La aplicación web vive en `apps/web`.

El design system compartido vive en `packages/ui`.

Backend, persistencia y contratos compartidos se incorporarán únicamente cuando se defina su arquitectura real.

## 2026-09-28 — UI foundation

shadcn/ui con Base UI.

Preset inicial: Rhea.

Iconografía: Lucide.

El preset es solamente un punto de partida. Los tokens y componentes finales pertenecen al design system de ABT.

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
