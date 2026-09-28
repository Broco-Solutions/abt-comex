# ABT COMEX

Sistema de gestión empresarial de ABT Comex.

## Arquitectura

Este repositorio es un monorepo de producto.

- `apps/web`: aplicación web Next.js.
- `packages/ui`: design system y componentes compartidos.
- `docs/product`: alcance y decisiones funcionales.
- `docs/frontend`: estándares de frontend y UX.
- `docs/architecture`: decisiones de arquitectura.

No crear `apps/api`, `packages/db`, `packages/contracts` ni otras capas hasta que exista una necesidad real y se defina su tecnología.

## Frontend

Antes de introducir nuevos patrones de UI, revisar:

`docs/frontend/FRONTEND_STANDARD.md`

Reglas generales:

- Reutilizar componentes y patrones existentes.
- No introducir colores, spacing, radios, tipografías o breakpoints arbitrarios.
- Responsive es obligatorio desde la primera implementación.
- Accesibilidad, estados de error, loading, empty y disabled forman parte de la feature.
- Los mensajes de error deben explicar qué ocurrió y, cuando sea posible, cómo corregirlo.
- No usar el color como única señal.
- Mantener apariencia Enterprise B2B: sobria, clara, consistente y orientada a uso operativo.
- No agregar dependencias sin una necesidad concreta.
- Preferir decisiones simples y reutilizables sobre abstracciones prematuras.

## Next.js

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Calidad

Antes de considerar terminado un cambio relevante:

- TypeScript debe pasar.
- ESLint debe pasar.
- Build debe pasar.
- No debe haber errores de consola evitables.
- La UI debe funcionar en desktop, notebook, tablet y mobile según corresponda.
- Deben contemplarse estados alternativos relevantes.
- Debe respetarse navegación por teclado y focus visible.

Usar skills, agentes o revisores especializados solamente cuando la complejidad o el riesgo lo justifiquen.

## Brand assets

Los assets oficiales de ABT COMEX están en:

`assets/brand/`

Archivos disponibles:

- `ABT_COMEX_logo_green_transparent.png`
  - Logo principal.
  - Usar sobre fondos blancos, claros o neutros.

- `ABT_COMEX_logo_white_transparent.png`
  - Versión negativa.
  - Usar sobre fondos verdes, oscuros o imágenes con suficiente contraste.

Reglas:

- Usar siempre los logos oficiales existentes.
- No recrear ni redibujar el logo.
- No deformar proporciones.
- Mantener margen libre alrededor del logo.
- Elegir la variante adecuada según contraste.
