# ABT COMEX

Sistema empresarial a medida para el comercio exterior argentino, centrado en la Operación completa de Importación y Exportación. Etapa actual: frontend real y navegable para validar con ABT; backend, persistencia de negocio e identidad real aún sin arquitectura definida.

## Entrada al proyecto

- [README](README.md): mapa del repositorio y documentación.
- [Runbook](docs/frontend/CODEX_RUNBOOK.md): procedimiento detallado, lectura proporcional, responsabilidades documentales y formato de entrega.
- [Plan](docs/frontend/PLAN_IMPLEMENTACION.md): etapa vigente, entregables y gates.
- [Índice frontend](docs/frontend/ESPECIFICACION_FUNCIONAL_FRONTEND.md): acceso a las fuentes autorizadas.

Leer este archivo y elegir el contexto en el runbook: una corrección pequeña necesita sus secciones y pruebas relevantes; una pantalla nueva necesita alcance, matriz, mapa, estándar y especificación; un cambio funcional exige evidencia original y decisiones de negocio.

## Fuentes autorizadas

- [Alcance](docs/product/ALCANCE_FUNCIONAL.md): qué producto se construye.
- [Matriz](docs/frontend/MATRIZ_COBERTURA_FUNCIONAL.md): necesidades, evidencia y trazabilidad.
- [Mapa](docs/frontend/MAPA_PANTALLAS_Y_RECORRIDOS.md): experiencias y recorridos.
- [Estándar](docs/frontend/FRONTEND_STANDARD.md): UX/UI transversal.
- [Pantallas](docs/frontend/screens/README.md): comportamiento particular.
- [Pruebas](docs/frontend/TEST_STRATEGY.md), [marca](docs/frontend/BRAND_USAGE.md), [arquitectura](docs/architecture/README.md) y [decisiones](docs/frontend/DECISIONS.md): autoridades especializadas.
- `/design-system` y `packages/ui`: patrones visuales ejecutables; sus mocks no son requisitos.

Modificar la autoridad y enlazar desde consumidores. No cerrar decisiones sólo en código/chat. Informar siempre impacto documental.

## Reglas fundamentales

- Operación es el núcleo; no inventar roles, permisos, campos, estados, fórmulas, relaciones o reglas sin respaldo.
- Evidencia observada, propuesta de diseño, decisión Broco y aprobación formal ABT son categorías distintas; no atribuir validaciones inexistentes.
- Ante contradicción funcional bloqueante, detener la parte dependiente y formular una pregunta concreta; continuar el resto seguro.
- Reutilizar DS y assets oficiales. ABT es marca principal; Broco, atribución secundaria.
- Responsive, WCAG 2.2 AA, sensibilidad, estados alternativos y ayuda forman parte del corte.
- Componentes genéricos en `packages/ui`; producto en `apps/web/features`, con fixtures determinísticos próximos a la feature.
- No crear `apps/api`, `packages/db`, `packages/contracts`, SDKs, backend, auth real ni API ficticia antes de definir su necesidad y arquitectura.
- No copiar datos sensibles de fuentes reales al repositorio.

## Trabajo y seguridad

Verificar ruta/rama/estado Git y preservar cambios previos. Trabajar autónomamente hasta completar un corte coherente, con pruebas y documentación proporcionales. Seguir el modo de ejecución del plan: la primera pasada integral permite avanzar por bloques verificados en sesiones sucesivas, con revisión humana integral antes de aprobarla. No confundir cierre técnico con aprobación de negocio o aptitud para producción.

No hacer commit/push sin pedido explícito. Deploy, merge a main, cambios de datos reales, borrados y mensajes a usuarios reales requieren intervención autorizada. No usar operaciones destructivas para resolver trabajo existente. No eludir restricciones técnicas; informar bloqueo y completar lo independiente.

La revisión visual principal es humana en localhost/preview. El runbook regula herramientas y evidencia; usar skills o revisores sólo si aportan valor por complejidad o riesgo.

## Next.js

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
