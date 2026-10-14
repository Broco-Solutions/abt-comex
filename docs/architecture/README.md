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

Estas capas no se crearán anticipadamente. La definición de contratos, identificadores, seguridad y fuentes puede avanzar en paralelo al frontend según el [roadmap operativo](../frontend/PLAN_IMPLEMENTACION.md#frontend-demostrativo-y-producto-operativo-real); no autoriza implementación de esas capas ni presupone esperar a finalizar todas las pantallas.

Estrategia de integraciones: [alcance §8](../product/ALCANCE_FUNCIONAL.md#8-sistemas-externos-y-fuentes-de-verdad) y [seguimiento técnico](../frontend/PLAN_IMPLEMENTACION.md#línea-transversal-de-integraciones). Priorizar Alpha2000 y evaluar primero MOA mediante ese proveedor; ARCA directo es alternativa condicionada, no dependencia simultánea. Conservar fuente original/intermediario por dato. COMEX360 no pertenece a la arquitectura objetivo: sin conector, servicio, migración comprometida ni fixtures visibles; su evidencia histórica no se convierte en contrato futuro.

Principio:

> Diseñar para crecer sin implementar complejidad antes de necesitarla.

## Frontend y frontera de datos

- Componentes genéricos, tokens y utilidades compartidas: `packages/ui`.
- Composición, vocabulario y lógica ABT: `apps/web`; features en `apps/web/features/<feature>`.
- Shell, navegación, marca e inducción transversal: componentes existentes de `apps/web/components`.
- Tipos, fixtures, fuentes mock y pruebas permanecen cerca de su feature. `index.ts` sólo cuando aporte valor.
- Flujo: UI → fuente/adaptador simple → fixtures determinísticos. Se sustituye la fuente al definir una API real, sin anticipar SDK, repositorios genéricos ni contratos compartidos.
- Para la primera pasada integral, reutilizar un grafo mínimo de fixtures sintéticos/anonimizados con IDs estables: clientes → cotizaciones/versiones → operaciones, documentos, controles, DJVE/permisos, tareas (también sin operación), gastos, facturación y Dirección. Compartir sólo entidades realmente consumidas entre features, sin crear un repositorio genérico o contrato de API ficticio. Conservar escenarios de apertura directa, DJVE autónoma y permiso sin DJVE; las cardinalidades de ejemplo no se vuelven reglas definitivas.
- Derivar estructuras y relaciones de evidencia ABT, no copiar nombres, CUIT, identificadores, documentos o importes reales. Datos y reloj determinísticos; pruebas de referencias existentes y conteos compartidos. Modelar sensibilidad por categoría según [alcance §7.2](../product/ALCANCE_FUNCIONAL.md#72-permisos-y-visibilidad), no por cargo inferido.
- No hardcodear datasets grandes en páginas; no crear directorios de features vacíos ni simular errores/latencias aleatorios.
- Sin `any` para evitar modelar un caso; responsabilidades claras y composición antes que props excesivas.
- No agregar dependencias sin necesidad concreta, justificación y revisión de impacto.
- No implementar backend, persistencia de negocio, auth real ni API ficticia durante esta etapa. La preferencia local temporal del Shell conserva su excepción documentada en [su especificación](../frontend/screens/01-foundation-application-shell.md).

El [estándar](../frontend/FRONTEND_STANDARD.md) gobierna interacción y estado relevante en URL. La [estrategia de pruebas](../frontend/TEST_STRATEGY.md) gobierna ubicación y comandos. Las capacidades técnicas enumeradas para evolución no constituyen una decisión de microservicios, motor de reglas o sistema de permisos.

## Entorno de demostración

Estado comprobado el 14/10/2026: proyecto `abt-comex` del equipo Vercel `broco-solutions`, asociado a `Broco-Solutions/abt-comex`. `main` en `1645bfc1094451447803c2f12af0f3ed7306a6af` produjo el deployment de producción `dpl_ASHbuHcgy7rjXkZsc7vAUSiEHJnc`, estado READY; los alias incluyen `https://abt-comex.brocosolutions.com`, con HTTPS, y el contenido de `main` cubre Etapas 0–9. Las rutas `/cotizaciones`, detalle, alta y edición respondieron HTTP 200. Esto no significa que el sitio esté protegido ni que sea apto para operación real.

La protección Vercel consultada tiene `ssoProtection.enabled=true` y `deploymentType=all_except_custom_domains`; por lo tanto el dominio personalizado queda excluido del SSO y responde públicamente. No se habilitó bypass ni se modificó DNS o configuración de seguridad. Previews protegidos redirigen a SSO y no se inspeccionaron sus páginas desde esta sesión. El repositorio GitHub es público al momento de esta verificación; mantener exclusivamente datos sintéticos y solicitar revisión de visibilidad con el responsable.

Configuración efectiva y criterio objetivo:

| Parámetro | Valor / motivo |
|---|---|
| Equipo / proyecto | Broco Solutions (`broco-solutions`) / `abt-comex`; repositorio público `Broco-Solutions/abt-comex` (visibilidad requiere revisión). |
| Framework / raíz | Next.js / `apps/web`, incluyendo archivos fuera de la raíz para resolver `@workspace/ui` y configuración compartida. |
| Node / instalación | Node 24.x, alineado con CI; `cd ../.. && pnpm install --frozen-lockfile`, respetando pnpm 10.33.4 del repositorio. |
| Build / salida | `cd ../.. && pnpm exec turbo run build --filter=web`; salida Next.js predeterminada bajo `apps/web/.next`. `next.config.ts` transpila `@workspace/ui`; no publicar `packages/ui` como aplicación separada. |
| Git | Producción de demostración desde `main`; previews por PR, sin desactivar el CI existente. Estrategia de ramas en el runbook. |
| Acceso | Vercel Authentication habilitado para despliegues excepto dominios personalizados. El dominio custom queda público hasta corregir/validar el alcance. No se añadieron contraseñas, bypass ni excepciones. No sustituye autenticación/permisos de negocio. |
| Dominio autorizado | Sólo `abt-comex.brocosolutions.com`. Obtener DNS exacto de Vercel y comprobar conflictos mediante Cloudflare antes de escribir; no tocar raíz, correo, otros subdominios ni reglas globales. |

Vercel [anunció el 09/09/2026](https://vercel.com/changelog/protect-production-deployments-for-free-on-every-plan) protección de todos los despliegues mediante Vercel Authentication sin cargo adicional; exige cuenta con acceso al proyecto. No contratar planes, complementos ni usuarios pagos. Si la cuenta efectiva no permite configurarla sin costo, detener el despliegue público y revisar alternativa autorizada.

La raíz, MX, correo, otros subdominios y reglas globales de Cloudflare no se modificaron durante esta verificación. No se realizaron cambios de DNS. Confirmar protección del dominio personalizado antes de colocar datos no sintéticos o abrir el entorno a usuarios externos; no contratar recursos sin autorización.
