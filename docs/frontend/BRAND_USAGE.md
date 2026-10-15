# ABT Comex — Uso de Marca

> Documento vivo · Última actualización: 09/10/2026

## 1. Objetivo

Establecer una aplicación consistente y profesional de las marcas ABT Comex y Broco Solutions en el producto.

ABT Comex es la marca principal. Broco Solutions aparece como autor tecnológico mediante una atribución secundaria, discreta y consistente.

## 2. Jerarquía de marca

```text
ABT Comex
→ identidad principal del producto

Powered by Broco Solutions
→ atribución secundaria del proveedor tecnológico
```

La atribución nunca debe competir con:

- el logo ABT;
- el nombre del módulo;
- las acciones principales;
- mensajes críticos;
- el contenido operativo.

## 3. Assets oficiales

Fuentes maestras:

```text
assets/brand/
├── ABT_COMEX_logo_green_transparent.png
├── ABT_COMEX_logo_white_transparent.png
├── ABT_COMEX_isotype_green_transparent.png
├── ABT_COMEX_isotype_white_transparent.png
├── BROCO_SOLUTIONS_logo_gradient.svg
└── BROCO_SOLUTIONS_isotype_gradient.svg
```

Cuando una aplicación necesite servir un asset desde web, se copia explícitamente a:

```text
apps/web/public/brand/
```

La fuente maestra permanece en `assets/brand/`.

No usar enlaces externos como fuente de logos.

## 4. Logo ABT Comex

### Variante verde

Usar sobre:

- fondos blancos;
- fondos claros;
- superficies neutras con contraste suficiente.

### Variante blanca

Usar sobre:

- verde ABT;
- fondos oscuros;
- imágenes o superficies que garanticen contraste.

### Reglas

- No recrear.
- No deformar.
- No recortar partes del logo.
- No alterar colores.
- No aplicar sombras, contornos o efectos.
- No ubicar sobre fondos con ruido visual.
- Mantener proporciones y área de seguridad.
- Usar tamaño legible, sin convertirlo en elemento decorativo dominante.

### Isotipo ABT

Los assets `ABT_COMEX_isotype_green_transparent.png` y
`ABT_COMEX_isotype_white_transparent.png` son recortes lossless del globo de
los masters oficiales homólogos. Conservan sus píxeles, canal alpha, escala y
proporción originales sobre un canvas transparente común de 796 × 717 px; no
son una recreación ni un vector generado.

- Usar la variante verde sobre fondos claros y la blanca sobre fondos oscuros.
- Usar el wordmark completo en sidebar expandida y drawer; reservar el isotipo
  para el rail compacto.
- No recolorear, filtrar, deformar ni recortar dinámicamente con CSS.
- No ampliar por encima de su tamaño útil original; reducirlo sólo conservando
  proporción y nitidez.
- Mantener como área de seguridad, como mínimo, el margen transparente incluido
  en el asset y no superponer otros elementos.
- Si se incorpora el vector oficial, reemplaza el raster derivado sin cambiar
  estas reglas.

## 5. Logo Broco Solutions

Los assets oficiales de atribución son:

```text
BROCO_SOLUTIONS_logo_gradient.svg
BROCO_SOLUTIONS_isotype_gradient.svg
```

El SVG `logo` contiene la marca completa y el SVG `isotype` contiene sólo el
símbolo. Se sirven como SVG, sin rasterizar ni alterar sus colores.

Sobre el pie neutro de la navegación institucional, el patrón es:

- expandida y drawer: texto visible `Powered by` más logo completo;
- rail compacto: sólo isotipo con tooltip y nombre accesible completos.

No repetir `Broco Solutions` en texto visible junto al logo completo, porque el
nombre ya forma parte del asset. La atribución no agrega una tarjeta propia:
usa el pie neutro del sidebar/drawer. Se mantiene claramente
menor que la marca ABT. No recolorear, deformar ni rasterizar los SVG.

## 6. Powered by Broco Solutions

Implementar un componente reusable:

```tsx
<BrandAttribution />
```

Contenido accesible:

```text
Powered by Broco Solutions
```

Destino:

```text
https://brocosolutions.com
```

### Ubicaciones

Aplicación interna:

- pie del sidebar;
- pie del drawer mobile;
- pantallas de acceso cuando existan.

Portal de clientes:

- footer general;
- pantallas de acceso e invitación.

No repetir la atribución en el cuerpo de cada pantalla.

### Comportamiento

- enlace externo claramente identificado;
- `target="_blank"` sólo si se incluye `rel="noopener noreferrer"`;
- nombre accesible completo;
- foco visible;
- target táctil suficiente;
- no depender sólo del logo para comunicar el destino;
- tooltip opcional, nunca único texto accesible.

### Presencia visual

- escala menor que ABT;
- contraste suficiente;
- sin competir con navegación;
- sin animaciones promocionales;
- sin slogans adicionales dentro del shell;
- margen suficiente alrededor del logo.

En modo expandido, el texto visible se limita a `Powered by`; el enlace anuncia
`Powered by Broco Solutions, enlace externo`. En modo compacto, el isotipo no
tiene texto visible y el enlace/tooltip anuncian `Powered by Broco Solutions`.

## 7. Aplicación por superficie

### Sidebar desktop

- ABT en la cabecera.
- Navegación como contenido principal.
- `BrandAttribution` al pie.
- La atribución usa la superficie existente; no sumar una card o fondo blanco
  sólo para Broco.

### Drawer mobile

- Misma jerarquía.
- Atribución al final del contenido, no pegada a acciones críticas.

### Header

No mostrar “Powered by” en el header principal. Mantenerlo orientado a contexto, navegación y usuario.

### Inicio y módulos

No repetir logos como decoración dentro de la aplicación.

### Portal de clientes

- ABT sigue siendo marca principal.
- La interfaz externa debe sentirse parte del mismo ecosistema sin reutilizar el shell interno.
- Broco aparece sólo como atribución secundaria.

### Pantallas de acceso

- ABT como identidad principal.
- Broco en footer o zona secundaria.
- Evitar composiciones de marketing o co-branding de igual jerarquía.

### PDFs, exportaciones e impresiones

La presencia de Broco se define por el tipo de documento. No agregar la atribución automáticamente en documentos comerciales o aduaneros sin decisión funcional explícita.

## 8. Uso de color

- Los colores de marca no reemplazan los colores semánticos del sistema.
- Verde ABT identifica marca y acción principal cuando corresponde.
- Success, warning, destructive e info mantienen su significado global.
- No usar azul Broco para introducir una segunda identidad visual dominante dentro del producto.

## 9. Copy y tono

El producto debe hablar como ABT:

- directo;
- profesional;
- claro;
- operativo;
- sin grandilocuencia;
- sin jerga técnica innecesaria.

`Powered by Broco Solutions` es la fórmula accesible aprobada. Junto al logo
completo, el texto visible se reduce a `Powered by` para no duplicar el nombre
contenido en la marca.

No usar:

- “Built with Broco”.
- “A Broco product”.
- slogans promocionales dentro de módulos.
- mensajes que confundan propiedad del producto.

## 10. Responsive

- El logo nunca debe deformarse para entrar.
- Usar dimensiones máximas y `object-fit: contain`.
- Mantener legibilidad en 390 px.
- No ocultar la atribución por falta de espacio; moverla a una ubicación adecuada.
- Evitar que el logo aumente la altura de navegación o footer de forma desproporcionada.

## 11. Accesibilidad

- `alt="ABT Comex"` para el logo principal cuando funciona como imagen informativa.
- Si el logo está dentro de un enlace con texto visible equivalente, usar `alt=""` para evitar repetición.
- `BrandAttribution` debe anunciar “Powered by Broco Solutions, enlace externo”.
- Contraste y foco cumplen WCAG 2.2 AA.
- No incrustar texto crítico únicamente dentro de una imagen.

## 12. Definition of Done de marca

Una pantalla o shell no está listo hasta que:

- usa assets oficiales;
- mantiene jerarquía ABT > Broco;
- la atribución está en una ubicación aprobada;
- el enlace funciona y es accesible;
- logos no se deforman ni recortan;
- responsive fue revisado;
- no existen duplicaciones decorativas;
- cualquier nuevo asset está documentado.
