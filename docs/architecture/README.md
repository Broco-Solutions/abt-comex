# Architecture

## Estructura actual

- `apps/web`: aplicación Next.js.
- `packages/ui`: design system compartido.

## Evolución prevista

Cuando exista una decisión tecnológica real, el monorepo podrá incorporar:

- API/backend;
- persistencia/base de datos;
- contratos compartidos;
- jobs o workers;
- integraciones;
- infraestructura.

Estas capas no se crearán anticipadamente.

Principio:

> Diseñar para crecer sin implementar complejidad antes de necesitarla.
