# ABT Comex

Sistema empresarial a medida para gestionar operaciones de Importación y Exportación. El frontend navegable y el Design System permiten validar procesos con ABT antes de definir backend, persistencia y autenticación real.
 
## Repositorio

- [apps/web](apps/web): aplicación Next.js; `/design-system` es su referencia visual.
- [packages/ui](packages/ui): componentes y tokens compartidos.
- [assets/brand](assets/brand): fuentes oficiales de marca.
- [Arquitectura](docs/architecture/README.md): fronteras y evolución técnica.

## Trabajar y navegar la documentación

Empezar por [AGENTS.md](AGENTS.md) y el [runbook](docs/frontend/CODEX_RUNBOOK.md). El [índice frontend](docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md) conduce a cada autoridad; el [plan](docs/frontend/PLAN_IMPLEMENTACION.md) indica el estado real y el siguiente gate.

Producto y evidencia: [alcance](docs/product/ALCANCE_FUNCIONAL.md), [matriz](docs/frontend/MATRIZ_COBERTURA_FUNCIONAL.md) y [mapa](docs/frontend/MAPA_PANTALLAS_Y_RECORRIDOS.md). Comportamiento particular: [pantallas](docs/frontend/screens/README.md).

Desarrollo local: `pnpm install` y `pnpm dev`. Comandos de calidad y límites de entorno en [TEST_STRATEGY.md](docs/frontend/TEST_STRATEGY.md). No hay backend ni autenticación real en el corte actual.
