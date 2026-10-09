# <Área> — <Vista o flujo>

> Estado: Draft  
> Etapa: <número y nombre>  
> Última actualización: <DD/MM/AAAA>  
> Owner funcional: <persona/área o pendiente>  
> Ruta prevista: `<ruta o pendiente>`

## 1. Objetivo

¿Qué problema resuelve esta pantalla o flujo?

## 2. Trabajo principal de la persona

> Cuando entro acá necesito…

Definir una sola tarea principal. Agregar tareas secundarias sólo si pertenecen al mismo contexto.

## 3. Evidencia y alcance de origen

- Requerimiento(s): `<ID / documento / sección>`
- Flujo AS IS / TO BE: `<referencia>`
- Alcance funcional: `<sección>`
- Decisiones relacionadas: `<referencia>`

No inventar requerimientos ausentes.

## 4. Usuarios y capacidades

### Capacidades necesarias

- `<capacidad>`

### Información sensible

- `<dato sensible y criterio>`

No definir perfiles definitivos si todavía no fueron validados.

## 5. Contexto de navegación

- Entrada(s): `<desde dónde se llega>`
- Salida(s): `<a dónde conduce>`
- Breadcrumb: `<propuesta>`
- Estado en URL: `<búsqueda/filtros/tabs/paginación>`
- Contexto que debe preservarse al volver: `<detalle>`

## 6. Información primaria

Información necesaria para comprender, decidir y actuar:

- `<dato / grupo>`

## 7. Información secundaria

Información útil bajo demanda:

- `<dato / grupo>`

Aplicar revelado progresivo.

## 8. Acciones

### Acción principal

- `<acción>`

### Acciones secundarias

- `<acción>`

### Acciones masivas

- `<si aplica>`

### Acciones destructivas o sensibles

- `<confirmación, permiso y auditoría>`

## 9. Reglas y validaciones

| ID / fuente | Regla | Respuesta de la interfaz | Bloquea | Excepción |
|---|---|---|---:|---|
| `<ID>` | `<regla>` | `<cálculo, alerta, error, ayuda>` | Sí/No | `<criterio>` |

## 10. Estados del objeto

- `<estado general>`
- `<etapa>`
- `<situaciones>`
- `<estado documental/control/administrativo si aplica>`

No reducir dimensiones distintas a un único badge.

## 11. Estados de pantalla

Definir comportamiento para:

- loading;
- loaded;
- empty;
- filtered-empty;
- error recuperable;
- error no recuperable;
- sin permiso;
- sólo lectura;
- información parcial;
- integración desactualizada;
- acción bloqueada;
- guardando/guardado si aplica.

Marcar los que no correspondan y explicar por qué.

## 12. Errores y recuperación

Para cada error relevante indicar:

- qué ocurrió;
- qué se preserva;
- acción de recuperación;
- dependencia externa o permiso;
- mensaje propuesto.

## 13. Responsive

### Desktop amplio

- `<criterio>`

### Notebook

- `<criterio>`

### Tablet

- `<criterio>`

### Mobile 390 px

- `<criterio>`

Definir qué se prioriza, reordena, resume o revela bajo demanda. No resolver automáticamente con scroll horizontal.

## 14. Accesibilidad

- orden de foco;
- navegación por teclado;
- nombres accesibles;
- foco en dialogs/drawers/popovers;
- semántica de tablas y encabezados;
- contraste;
- avisos dinámicos;
- targets táctiles;
- movimiento reducido.

Agregar requisitos específicos de la pantalla.

## 15. Ayuda e inducción

- ayuda contextual necesaria;
- concepto que requiere explicación;
- checklist o guía asociada;
- posibilidad de omitir/retomar;
- contenido de primer acceso si aplica.

No usar onboarding para compensar una interfaz poco clara.

## 16. Branding

- ubicación del logo ABT si corresponde;
- `BrandAttribution` si la superficie lo requiere;
- variante de logo;
- restricciones particulares.

## 17. Fuente de datos y fixtures

- fuente futura prevista;
- adaptador/mock actual;
- fixtures requeridos;
- fuente y frescura visible;
- casos con datos incompletos;
- datos sensibles a excluir.

## 18. Métricas de experiencia

Sólo cuando aporte valor:

- tarea completada;
- tiempo o pasos;
- abandono;
- error prevenido;
- uso de ayuda;
- filtro o vista guardada.

No instrumentar métricas sin propósito.

## 19. Escenarios de prueba

### Unitarios

- `<escenario>`

### Componentes

- `<escenario>`

### Integración de pantalla

- `<escenario>`

### E2E

- `<escenario crítico>`

### Manuales

- `<responsive, teclado, textos largos, errores>`

## 20. Criterios de aceptación

- [ ] El propósito se entiende sin explicación externa.
- [ ] El próximo paso o acción principal es visible.
- [ ] Respeta lenguaje de ABT.
- [ ] Reutiliza patrones del Design System.
- [ ] Previene errores relevantes.
- [ ] Contempla permisos y sensibilidad.
- [ ] Estados alternativos están definidos.
- [ ] Responsive está especificado.
- [ ] Accesibilidad está especificada.
- [ ] Pruebas necesarias están definidas.
- [ ] Ayuda/onboarding está resuelto o no aplica.
- [ ] No contradice alcance.

## 21. Fuera de alcance

- `<punto>`

## 22. Decisiones pendientes

| Pregunta | Impacto | Recomendación | Responsable / instancia |
|---|---|---|---|
| `<pregunta concreta>` | `<qué cambia>` | `<opción recomendada>` | `<pendiente>` |

## 23. Implementación

- Feature: `apps/web/features/<feature>`
- Ruta: `apps/web/app/<ruta>`
- Componentes de UI: `<lista>`
- Pruebas: `<ubicación>`
- Preview / revisión: `<pendiente>`

## 24. Resultado de revisión humana

> Completar después de revisar la implementación.

- Viewports revisados:
- Escenarios revisados:
- Observaciones:
- Ajustes requeridos:
- Estado final: Draft / Under review / Approved
