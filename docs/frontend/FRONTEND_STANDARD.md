# ABT Comex — Frontend Standard

## Objetivo

Construir un sistema Enterprise B2B de uso diario que transmita orden, control, trazabilidad y profesionalismo.

Prioridades:

1. Claridad.
2. Consistencia.
3. Velocidad de operación.
4. Densidad útil de información.
5. Accesibilidad.
6. Calidad visual.
7. Responsive.
8. Reutilización.

Evitar estética de landing, efectos decorativos innecesarios y patrones genéricos de demo.

## Stack

- Next.js App Router
- React
- TypeScript strict
- Tailwind CSS
- shadcn/ui sobre Base UI
- Lucide
- pnpm
- Turborepo

## Design system

Toda decisión visual reutilizable debe expresarse mediante tokens o componentes compartidos.

No introducir arbitrariamente:

- colores hexadecimales;
- tamaños de fuente;
- spacing;
- radios;
- sombras;
- alturas de controles;
- breakpoints.

Los colores semánticos deben mantener el mismo significado en toda la aplicación:

- primary
- success
- warning
- destructive
- info
- neutral

El color nunca será la única señal de estado.

## Tipografía

La tipografía y su escala se definen globalmente.

No modificar fuentes o escalas por pantalla salvo decisión explícita de diseño.

## Formularios

- Todo campo tiene label visible.
- Required y optional deben ser inequívocos.
- Placeholder no reemplaza label.
- Los errores se muestran junto al campo correspondiente.
- Los mensajes deben ser específicos y accionables.
- Nunca borrar datos ingresados debido a una validación.
- Read-only y disabled deben distinguirse correctamente.
- Evitar validar agresivamente mientras el usuario escribe.

## Mensajes

Evitar:

- "Error"
- "Campo inválido"
- "Algo salió mal"

Preferir mensajes que indiquen:

1. qué ocurrió;
2. dónde ocurrió;
3. cómo corregirlo cuando sea posible.

## Patrones

Listados, detalles, formularios, filtros, búsquedas, dialogs, confirmaciones, acciones y estados deben funcionar igual en todos los módulos.

No crear un patrón nuevo si ya existe uno equivalente.

## Responsive

Responsive es parte de la implementación, no una etapa posterior.

Objetivos:

- Desktop: experiencia completa.
- Notebook: experiencia completa.
- Tablet: completamente operativa.
- Mobile: funcional y comprensible.

## Accesibilidad

Piso obligatorio: WCAG 2.2 AA.

Como mínimo:

- navegación por teclado;
- focus visible;
- contraste adecuado;
- labels correctos;
- targets razonables;
- estado no comunicado sólo mediante color;
- errores asociados correctamente a sus controles.

## Estados

Cuando correspondan, diseñar explícitamente:

- loading;
- loaded;
- empty;
- filtered-empty;
- error;
- disabled;
- read-only;
- success.

## Definition of Done

Una pantalla o feature relevante no está terminada hasta que:

- respeta tokens y componentes existentes;
- funciona responsive;
- contempla sus estados relevantes;
- es usable con teclado;
- los errores son claros;
- no presenta errores evitables de consola;
- TypeScript pasa;
- lint pasa;
- build pasa;
- se revisó visualmente.
