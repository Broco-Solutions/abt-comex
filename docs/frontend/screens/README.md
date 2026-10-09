# ABT Comex — Especificaciones de Pantallas

## Propósito

Esta carpeta contiene la especificación funcional y UX de cada pantalla o flujo relevante.

El alcance define qué producto se construye. La especificación general de frontend define los patrones. Estos archivos bajan ambas cosas a una vista concreta antes de implementarla.

## Regla principal

Una pantalla o flujo no debe pasar a implementación si no tiene una especificación suficientemente completa para su riesgo.

No es necesario llenar campos irrelevantes. Sí es obligatorio dejar explícitos los pendientes que pueden cambiar la solución.

## Estados de una especificación

- `Draft`: en elaboración.
- `Ready`: cumple Definition of Ready.
- `In implementation`: etapa en curso.
- `Under review`: implementación lista para revisión humana.
- `Approved`: comportamiento validado para el corte actual.
- `Superseded`: reemplazada por otra especificación.

El estado no implica aprobación definitiva del producto; describe el corte actual.

## Convención de nombres

```text
NN-area-vista.md
```

Ejemplos:

```text
01-foundation-application-shell.md
02-foundation-inicio.md
03-work-mi-trabajo.md
04-operations-listado.md
05-operations-detalle.md
06-operations-crear.md
07-clients-listado.md
08-clients-detalle.md
```

El número expresa orden de trabajo, no ruta ni prioridad eterna.

## Inventario inicial

| Orden | Área | Vista / flujo | Etapa | Estado |
|---:|---|---|---:|---|
| 01 | Fundamentos | Application Shell | 1 | Ready |
| 02 | Fundamentos | Inicio | 2 | Draft |
| 03 | Trabajo | Mi trabajo | 2 | Draft |
| 04 | Operaciones | Listado | 3 | Draft |
| 05 | Operaciones | Detalle común | 4 | Draft |
| 06 | Operaciones | Creación guiada | 5 | Draft |
| 07 | Clientes | Listado | 6 | Draft |
| 08 | Clientes | Detalle | 6 | Draft |
| 09 | Importación | Vertical operativa | 7 | Draft |
| 10 | Exportación | Vertical operativa | 8 | Draft |
| 11 | Exportación | DJVE | 8 | Draft |
| 12 | Cotizaciones | Listado y detalle | 9 | Draft |
| 13 | Cotizaciones | Creación, versión y aprobación | 9 | Draft |
| 14 | Administración | Cola administrativa | 10 | Draft |
| 15 | Gestión | Resumen ejecutivo | 11 | Draft |
| 16 | Portal | Inicio y operaciones habilitadas | 12 | Draft |

El inventario se actualiza cuando cambia el plan, no para registrar cada componente menor.

## Uso de la plantilla

1. Copiar `SCREEN_TEMPLATE.md`.
2. Renombrar según convención.
3. Completar evidencia y decisiones conocidas.
4. Marcar pendientes concretos.
5. Definir criterios de aceptación y escenarios de prueba.
6. Cambiar a `Ready` sólo cuando cumpla Definition of Ready.

## Relación con código

La especificación debe enlazar:

- rutas;
- feature owner en `apps/web/features`;
- componentes de Design System utilizados;
- fixtures relevantes;
- pruebas;
- decisiones permanentes.

El código no necesita copiar el texto del documento; debe poder trazarse a él.

## Actualización

Actualizar una especificación cuando cambie:

- objetivo;
- información principal;
- acciones;
- reglas;
- estados;
- permisos;
- responsive;
- ayuda/onboarding;
- fuentes de datos;
- criterios de aceptación.

No actualizar por refactors internos que no cambian experiencia ni comportamiento.

## Revisión

La revisión humana debe comprobar al menos:

- propósito;
- navegación;
- jerarquía;
- comportamiento;
- estados;
- responsive;
- accesibilidad;
- coherencia con alcance;
- coherencia con otras pantallas;
- pruebas definidas.

## Definition of Ready

Una especificación puede marcarse `Ready` cuando:

- el trabajo principal está claro;
- alcance y fuera de alcance están definidos;
- información y acciones principales están identificadas;
- reglas y permisos están resueltos o marcados como pendientes no bloqueantes;
- estados relevantes están listados;
- responsive tiene criterio;
- escenarios de prueba existen;
- no contradice el alcance ni el Design System.

## Definition of Done

Puede marcarse `Approved` para el corte actual cuando:

- implementación completa;
- pruebas requeridas pasan;
- revisión visual y funcional realizada;
- documentación sincronizada;
- pendientes nuevos registrados;
- no quedan regresiones conocidas sin decisión explícita.
