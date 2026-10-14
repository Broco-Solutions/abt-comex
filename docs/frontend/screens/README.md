# Especificaciones de pantallas

Esta carpeta es autoridad del comportamiento particular de cada pantalla/flujo. El [mapa](../MAPA_PANTALLAS_Y_RECORRIDOS.md) inventaría todas las experiencias; el [estándar](../FRONTEND_STANDARD.md) define patrones y el [plan](../PLAN_IMPLEMENTACION.md) gobierna entregas.

## Especificaciones existentes

| Archivo                                                  | Corte   | Estado de especificación                                                                 |
| -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| [01 — Shell](01-foundation-application-shell.md)         | Etapa 1 | Approved; limitación de navegadores registrada en el plan                                |
| [02 — Inicio + Mi trabajo](02-inicio-mi-trabajo.md)      | Etapa 2 | Under review; integrada a main, revisión humana pendiente                                |
| [03 — Listado de Operaciones](03-operaciones-listado.md) | Etapa 3 | Under review; PR #8 integrado, CI y deployment READY, revisión humana pendiente          |
| [04 — Detalle de Operación](04-operacion-detalle.md)     | Etapa 4 | Under review; PR #9 integrado, CI y deployment READY, revisión humana integral pendiente |
| [05 — Creación de Operación](05-creacion-operacion.md)   | Etapa 5 | Under review; PR #12 integrado, CI y producción READY; revisión humana pendiente         |
| [06 — Clientes](06-clientes.md)                          | Etapa 6 | Under review; PR #10 integrado, CI y deployment READY, revisión humana pendiente         |
| [07 — Importación](07-importacion.md)                    | Etapa 7 | Under review; PR #13 integrado, CI/deployment READY y revisión humana pendiente          |
| [08 — Exportación y DJVE](08-exportacion-djve.md)        | Etapa 8 | Under review; PR #14 integrado, CI/deployment READY, revisión humana pendiente           |
| [09 — Cotizaciones](09-cotizaciones.md)                  | Etapa 9 | Under review; PR #11 integrado, producción READY, revisión humana pendiente              |

La experiencia de Etapa 13 todavía no tiene especificación. No denominarla Draft hasta que exista un documento. Un ID UI puede corresponder a una sección o acción, no necesariamente a un archivo/página independiente.

## Ciclo de una especificación

- `Draft`: en elaboración o pendiente de revisión.
- `Ready`: cumple [Definition of Ready](../CODEX_RUNBOOK.md#preparación-y-cierre), con evidencia de revisión según el modo de ejecución; no equivale a aprobación ABT.
- `In implementation`: implementación en curso.
- `Under review`: implementación lista para revisión humana.
- `Approved`: comportamiento validado por revisión humana para el corte registrado; en la primera pasada puede resolverse en la revisión integral.
- `Superseded`: reemplazada, conservando referencia al sucesor.

El estado de especificación no sustituye el estado de etapa ni una aprobación formal de negocio. Registrar instancia/persona, fecha, alcance y evidencia; no completarlos por inferencia.

## Crear o mantener

Usar [SCREEN_TEMPLATE.md](SCREEN_TEMPLATE.md) y nombre `NN-area-vista.md`. La numeración organiza trabajo, no define rutas. Completar lo necesario para el riesgo: una vista simple puede ser breve; Importación, Exportación, DJVE o Administración requieren detalle de reglas, variantes, custodia, cruces y pruebas.

Etapa 10: [Administración y Finanzas](10-administracion-finanzas.md) · cola, detalle y fuentes financieras demostrativas; Under review.

Etapa 11: [Gestión y Dirección](11-gestion-direccion.md) · panorama operativo sintético y fuentes económicas no conectadas; Under review.

Etapa 12: [Portal de Clientes](12-portal-clientes.md) · identidad y permisos sólo demostrativos; en implementación.

Enlazar evidencia con namespace, necesidad de matriz, experiencia/recorrido, regla, escenario y etapa. Al implementar, agregar rutas reales de código y pruebas. Actualizar por cambios de comportamiento, información, acciones, estados, permisos, responsive, ayuda o aceptación; no por refactors sin impacto. No copiar las normas del estándar o los comandos de pruebas.
