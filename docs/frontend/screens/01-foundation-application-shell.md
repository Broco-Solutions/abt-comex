# Fundamentos — Application Shell

> Estado: Ready  
> Etapa: 1 — Application Shell e infraestructura de experiencia  
> Última actualización: 09/10/2026  
> Owner funcional: pendiente de validación con ABT  
> Ruta prevista: grupo `(app)`; `/` redirige a `/inicio`

## 1. Objetivo

Dar orientación, navegación y acceso a ayuda consistentes a la aplicación interna. El shell envuelve vistas futuras sin decidir sus reglas de negocio.

## 2. Trabajo principal de la persona

> Cuando entro a la aplicación necesito reconocer dónde estoy y llegar a la sección de trabajo correspondiente.

## 3. Evidencia y alcance de origen

- Alcance: `ALCANCE_FUNCIONAL.md` §9, navegación conceptual.
- Experiencia: `ESPECIFICACION_FUNCIONAL_FRONTEND.md` §§5–6, 8–13.
- Implementación: `PLAN_IMPLEMENTACION.md` Etapa 1.
- Marca: `BRAND_USAGE.md` §§3–7.
- Flujos AS IS / TO BE detallados: no aplican al contenedor de navegación.

## 4. Usuarios y capacidades

El shell representa sólo secciones habilitadas por capacidades recibidas; no define perfiles ni concede acceso. La fuente de capacidades y la política de visibilidad siguen pendientes. Los datos económicos o privados no aparecen en el shell por defecto.

## 5. Contexto de navegación

- Entradas: `/` hacia `/inicio`; enlaces internos autorizados y URL directa.
- Secciones previstas: Inicio, Operaciones (Todas, Importaciones, Exportaciones), Clientes, Cotizaciones, Mi trabajo, Administración y Finanzas, Gestión y Configuración. Las rutas de Etapa 1 son `/inicio`, `/operaciones`, `/clientes`, `/cotizaciones`, `/mi-trabajo`, `/administracion`, `/gestion`, `/configuracion`.
- Salidas: sección seleccionada; `/design-system` queda fuera del shell.
- Breadcrumb: jerarquía de ubicación, no historial; en rutas sin subnivel no se inventa una cadena.
- URL: cada sección conserva su ruta; estado de filtros pertenece a la vista, no al shell.
- Al volver se conserva el contexto de URL y el foco retorna de drawer/dialog a su disparador.

## 6. Información primaria

Marca ABT, sección actual, navegación disponible, contexto de página y entrada de ayuda. El contenido de cada sección pertenece a su especificación.

## 7. Información secundaria

`BrandAttribution` al pie de sidebar/drawer. Identidad de usuario, búsqueda global y notificaciones: sólo presentación o entrada inicial cuando exista definición; sin contenido real en este corte.

## 8. Acciones

- Principal: navegar a una sección habilitada.
- Secundarias: abrir/cerrar navegación mobile y ayuda; consultar breadcrumb.
- Masivas o destructivas: no aplican.
- Acción no disponible: explicar causa y vía de resolución cuando la capacidad se conozca; no simular autorización.

## 9. Reglas y validaciones

| Fuente | Regla | Respuesta de interfaz | Bloquea | Excepción |
|---|---|---|---|---|
| Alcance §9 | No convertir capacidades contextuales en navegación principal | Menú acotado | No | Nuevas secciones requieren validación |
| Frontend §10 | El frontend representa autorización | Secciones y acciones según capacidades mock explícitas | Sí cuando corresponda | Política definitiva pendiente |
| Marca §6 | ABT principal; Broco secundario | Logo ABT en cabecera; atribución al pie | No | Portal usa shell propio |

## 10. Estados del objeto

No aplica: el shell no es un objeto de negocio.

## 11. Estados de pantalla

- Loading: conservar estructura y orientación; no afirmar permisos durante carga.
- Loaded: navegación, sección activa, breadcrumb y contenido.
- Error recuperable: explicar fallo de carga, conservar ubicación y ofrecer reintento.
- Error no recuperable: mensaje claro y camino seguro a Inicio o soporte definido.
- 404: identificar ruta no encontrada y ofrecer navegación disponible.
- Sin permiso: no revelar contenido protegido; explicar que el acceso falta y cómo solicitarlo una vez definido el proceso.
- Información parcial: identificar qué parte falta y preservar navegación utilizable.
- Empty y filtered-empty: pertenecen a la vista hija, no al shell.
- Sólo lectura, guardando/guardado e integración desactualizada: pertenecen a features futuras.
- Acción bloqueada: motivo y resolución cerca de la acción; no depender de color.

## 12. Errores y recuperación

La página de error debe decir qué no se pudo mostrar, que la navegación y la URL se conservan, y permitir reintentar. 404 ofrece un regreso seguro. Acceso denegado no revela datos de la vista ni redirige silenciosamente.

## 13. Responsive

- Desktop 1440: sidebar y contenido con jerarquía completa.
- Notebook 1280/1024: navegación completa sin comprimir acciones críticas; contenido conserva densidad legible.
- Tablet 768: navegación adaptada; acciones principales visibles y secundarias agrupadas.
- Mobile 390: drawer accesible, foco administrado, targets táctiles y contenido priorizado. La atribución permanece al final del drawer.
- No usar scroll horizontal como respuesta general a la reducción de ancho.

## 14. Accesibilidad

Landmarks `nav` y `main`, un título de página por vista, enlace de salto al contenido, nombre de navegación, estado activo con `aria-current`, orden de tabulación lógico, foco visible y no oculto. Drawer: foco inicial y devolución al control, Escape y cierre explícito. Botones con nombres accesibles. Mensajes dinámicos anunciados cuando corresponda. Verificar contraste, zoom 200 %, reducción de movimiento y targets táctiles conforme WCAG 2.2 AA.

## 15. Ayuda e inducción

Entrada de ayuda accesible desde el shell. Bienvenida y checklist base no bloqueantes, omitibles y retomables; capacidades derivadas de permisos mock, nunca de selección manual de rol. Contenido concreto y persistencia se definen con flujos reales. No incluir tour visual completo.

## 16. Branding

Logo ABT oficial en cabecera con variante según fondo. `BrandAttribution` de `apps/web/components/brand/brand-attribution.tsx` al pie de sidebar/drawer, sobre superficie clara para el logo navy oficial. No repetir logos en contenido ni poner atribución en header.

## 17. Fuente de datos y fixtures

En Etapa 1, navegación y capacidades mock explícitas detrás de una fuente simple sólo si existe consumidor. UI → fuente simple de la feature → fixture determinístico. Sin usuario real, auth, API ni datos sensibles. Fuente y frescura externas no aplican al contenedor.

## 18. Métricas de experiencia

No se instrumentan en Etapa 1.

## 19. Escenarios de prueba

- Unitarios: selección de elemento activo o transformación pura sólo si se introduce lógica.
- Componentes: enlaces, `aria-current`, drawer, foco, Escape, ayuda y atribución con axe.
- Integración: URL directa, 404, error, acceso denegado, loading y navegación sin pérdida de contexto.
- E2E: navegación básica desktop y mobile; primer acceso, omitir y retomar ayuda; teclado.
- Manuales: 1440, 1280, 1024, 768 y 390 px; zoom, contraste, foco, textos largos y superficie clara del logo Broco.

## 20. Criterios de aceptación

- [ ] Se identifica ubicación, sección activa y próximo destino sin explicación externa.
- [ ] Navegación usa lenguaje y rutas previstas; `/design-system` queda fuera.
- [ ] ABT mantiene jerarquía sobre atribución Broco.
- [ ] Loading, error, 404 y acceso denegado preservan contexto y ofrecen salida.
- [ ] Drawer, ayuda y onboarding base son operables con teclado y foco correcto.
- [ ] Los cinco anchos previstos son utilizables sin overflow accidental.
- [ ] Axe no presenta violaciones conocidas y la revisión manual cubre contraste y WCAG 2.2 AA.
- [ ] No se inventan usuario, permisos ni contenido profundo de módulos.

## 21. Fuera de alcance

Pantallas profundas, dashboard de Inicio, menú de perfil definitivo, notificaciones reales, búsqueda funcional completa, backend, persistencia, auth y Portal.

## 22. Decisiones pendientes

| Pregunta | Impacto | Recomendación | Responsable / instancia |
|---|---|---|---|
| ¿Qué capacidades habilitan cada sección? | Visibilidad y acceso | Mantener mock explícito hasta definir política | ABT / arquitectura de permisos |
| ¿Qué datos mínimos muestra identidad de usuario? | Header y ayuda | No inventar persona ni menú definitivo | ABT, antes de cerrar Etapa 1 |
| ¿Qué contenido inaugura el checklist? | Inducción | Base breve y retomable; validar texto con flujos | ABT / UX |
| ¿Qué resuelve la búsqueda global inicial? | Header | Entrada no profunda hasta validar alcance | ABT / UX |

## 23. Implementación

- Feature futura: `apps/web/features` según consumidor; no se crea estructura vacía en Etapa 0.
- Ruta futura: `apps/web/app/(app)`; Etapa 0 no la implementa.
- UI prevista: patrones existentes de `packages/ui`; `BrandAttribution` de producto.
- Pruebas: junto a componentes y en `apps/web/e2e/specs`.
- Preview / revisión: pendiente de Etapa 1.

## 24. Resultado de revisión humana

Pendiente de implementación y revisión de Etapa 1.
