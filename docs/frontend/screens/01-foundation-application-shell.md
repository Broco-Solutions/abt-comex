# Fundamentos — Application Shell

> Estado: Complete with environment limitation
> Etapa: 1 — Application Shell e infraestructura de experiencia  
> Última actualización: 10/10/2026
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
- Secciones previstas: Inicio, Mi trabajo, Operaciones (Importaciones y Exportaciones), Clientes, Cotizaciones, Administración y Finanzas, Gestión y Configuración. Inicio y Mi trabajo son destinos consecutivos, separados visualmente de los dominios del negocio; Mi trabajo mantiene su ruta principal `/mi-trabajo` y no se anida bajo Inicio. Operaciones es un enlace a la vista completa en `/operaciones`; sus dos hijos visibles son vistas filtradas y no existe un ítem redundante “Todas”. Las rutas de Etapa 1 son `/inicio`, `/mi-trabajo`, `/operaciones`, `/clientes`, `/cotizaciones`, `/administracion`, `/gestion`, `/configuracion`.
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
- Secundarias: contraer/expandir navegación desktop, abrir/cerrar navegación
  mobile y ayuda; consultar breadcrumb.
- Masivas o destructivas: no aplican.
- Acción no disponible: explicar causa y vía de resolución cuando la capacidad se conozca; no simular autorización.

## 9. Reglas y validaciones

| Fuente | Regla | Respuesta de interfaz | Bloquea | Excepción |
|---|---|---|---|---|
| Alcance §9 | No convertir capacidades contextuales en navegación principal | Menú acotado | No | Nuevas secciones requieren validación |
| Frontend §10 | El frontend representa autorización | Secciones y acciones según capacidades mock explícitas | Sí cuando corresponda | Política definitiva pendiente |
| Marca §6 | ABT principal; Broco secundario | Logo ABT en cabecera; atribución al pie | No | Portal usa shell propio |
| Frontend §5.1 | Operaciones abre la vista completa y sus hijos son filtros | Padre seleccionado en `/operaciones`; padre como sección activa y un único hijo seleccionado en vistas filtradas | No | No existe el ítem “Todas” |

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

- Desktop 1440: sidebar expandida por defecto, rail compacto opcional y
  contenido que aprovecha el ancho liberado.
- Desktop 1440 y notebook 1280: onboarding agrupado en una única sección con ancho interior controlado, introducción levemente más ancha, checklist próximo y divisor vertical sutil.
- Notebook 1280 y 1024: sidebar inline expandida/compacta, navegación completa
  y onboarding apilado en 1024 para conservar longitud de lectura y checklist.
- Tablet 960, 900, 820 y 768: drawer completo; no se muestra rail ni se hereda
  visualmente la preferencia compacta.
- Mobile 390: drawer accesible, foco administrado, targets táctiles y contenido priorizado. La atribución permanece al final del drawer.
- No usar scroll horizontal como respuesta general a la reducción de ancho.

## 14. Accesibilidad

Landmarks `nav` y `main`, un título de página por vista, enlace de salto al contenido, nombre de navegación y un único destino seleccionado con `aria-current="page"`. Sección activa y destino seleccionado se distinguen mediante peso, indentación, fondo, indicador e iconografía, sin reducir los destinos inactivos a una apariencia disabled. Mantener orden de tabulación lógico y foco visible y no oculto. El toggle conserva foco y nombre dinámico; tooltips aparecen con hover y foco. El flyout compacto de Operaciones es alcanzable con Tab, cierra con Escape y devuelve foco. Drawer: foco inicial y devolución al control, Escape y cierre explícito. Botones con nombres accesibles. Mensajes dinámicos anunciados cuando corresponda. Verificar contraste, zoom 200 %, reducción de movimiento y targets táctiles conforme WCAG 2.2 AA.

## 15. Ayuda e inducción

Entrada de ayuda accesible desde todo el shell. El estado y el progreso son
globales, pero la bienvenida y el checklist completos se renderizan sólo en
`/inicio`. Allí forman una única sección compacta, sin cards internas ni altura
mínima: dos columnas agrupadas en 1440/1280 y orden vertical introducción,
descripción, omitir, progreso y checklist en 1024/768/390. Al omitir o completar
se desmonta sin reservar espacio.

En los demás módulos no se monta un contenedor, banner ni copia del panel. Ayuda
permite consultar el progreso, reiniciar y retomar; retomar desde otra ruta
navega declarativamente a `/inicio` y conserva el avance. La inducción nunca
bloquea la navegación, no fuerza redirecciones al abrir una ruta directa y no
abre automáticamente un modal por módulo. Las capacidades se derivan de
permisos mock, nunca de selección manual de rol. No incluir tour visual
completo.

## 16. Branding

Wordmark ABT oficial verde en sidebar expandida y drawer. El rail compacto usa
el isotipo verde oficial derivado lossless; la variante blanca queda disponible
para fondos oscuros futuros. `BrandAttribution` de
`apps/web/components/brand/brand-attribution.tsx` muestra `Powered by` más el
logo completo SVG de Broco al pie de sidebar/drawer. En el rail usa sólo el
isotipo SVG, con tooltip y nombre accesible completos; no repite el nombre
Broco como texto visible junto al logo. La atribución es menor que ABT y no
agrega fondo blanco propio. No repetir logos en contenido ni poner atribución
en header.

## 17. Fuente de datos y fixtures

En Etapa 1, navegación y capacidades mock explícitas detrás de una fuente simple sólo si existe consumidor. UI → fuente simple de la feature → fixture determinístico. La preferencia expandida/compacta se persiste temporalmente en `localStorage` con clave `abt-comex:navigation:v1`, aislada detrás del provider, SSR-safe, reseteable y con fallback expandido ante valores inválidos. El modo overlay depende del viewport y no se guarda. Sin usuario real, auth, API ni datos sensibles. Fuente y frescura externas no aplican al contenedor.

## 18. Métricas de experiencia

No se instrumentan en Etapa 1.

## 19. Escenarios de prueba

- Unitarios: selección activa, provider expandido/compacto, persistencia,
  fallback inválido, SSR y reset.
- Componentes: enlaces, `aria-current`, toggle, logos por modo, tooltips,
  flyout, drawer, foco, Escape, ayuda y atribución con axe.
- Integración: URL directa, 404, error, acceso denegado, loading y navegación sin pérdida de contexto.
- E2E: navegación básica desktop y mobile; cambio y persistencia de modo,
  flyout; panel de inducción sólo en Inicio, progreso global, omitir, completar,
  reiniciar y retomar desde otro módulo; teclado.
- Manuales: 1440, 1280, 1024, 960, 900, 820, 768 y 390 px; zoom,
  contraste, foco, textos largos, isotipo y jerarquía ABT/Broco.

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

- Componentes de producto: `apps/web/components/app-shell`, `navigation`,
  `onboarding`, `brand` y `states`.
- Rutas: `apps/web/app/(app)`; `/` redirige a `/inicio` y
  `/design-system` permanece fuera del shell.
- UI: patrones existentes de `packages/ui`, `BrandAttribution` y `Dialog`
  genérico incorporado al Design System antes de usarlo en drawer y ayuda.
- Pruebas: junto a los componentes y en
  `apps/web/e2e/specs/application-shell.spec.ts`.
- Búsqueda global e identidad de usuario: diferidas en este corte porque su
  alcance sigue pendiente; no se muestra una simulación que sugiera capacidad
  real.
- Preview / revisión: revisión visual humana de Etapa 1 aprobada el
  10/10/2026; validación funcional de módulos futuros pendiente.

## 24. Resultado de revisión humana

La revisión visual humana de Etapa 1 fue aprobada el 10/10/2026. Chromium
cubre los recorridos E2E y snapshots locales del Shell. Firefox y WebKit no
tienen una ejecución local concluyente por dependencias del host; no se ha
comprobado un fallo del producto en esos navegadores. Las definiciones
funcionales de ABT enumeradas arriba siguen pendientes.
