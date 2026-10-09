# ABT Comex — Uso de Marca

> Documento vivo · Última actualización: 08/10/2026

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
└── BROCO_SOLUTIONS_logo_navy_transparent.png
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

## 5. Logo Broco Solutions

El asset oficial de uso inicial es:

```text
BROCO_SOLUTIONS_logo_navy_transparent.png
```

Está optimizado para superficies claras. En una navegación oscura, la atribución debe vivir dentro de una pequeña superficie clara o neutra; no recolorear el logo de forma improvisada.

Si se incorpora una variante oficial blanca en el futuro, debe agregarse como asset separado y documentarse.

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

## 7. Aplicación por superficie

### Sidebar desktop

- ABT en la cabecera.
- Navegación como contenido principal.
- `BrandAttribution` al pie.
- Si el sidebar es oscuro y el logo Broco es navy, usar superficie clara sutil.

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

“Powered by Broco Solutions” es la única fórmula de atribución inicial aprobada.

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