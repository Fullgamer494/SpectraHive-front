<!-- Assisted by Codex (SI) — reviewed by pendiente -->

# HUD de ingeniería / minimalismo táctico

Dirección vigente desde el 15 de noviembre de 2026. Sustituye la exploración visual NOCTRA y la tipografía pixelada; conserva el flujo científico definido en `docs/spec/00-contexto-general.md`.

## Distribución conservada

| Zona | Contenido | Comportamiento |
| --- | --- | --- |
| Superior | Marca, objeto activo, capa de cielo, FOV y tema | Dos filas sólidas; capa/FOV centrados. |
| Izquierda | Accesos de herramientas, objetos de prueba y coordenadas | Paneles desplegados, sin drawers ni superposición sobre el cielo. Los accesos llevan el foco a cada sección. |
| Centro | Aladin, etiqueta del contexto y lectura de coordenadas | Celda propia; el canvas no se extiende detrás de los paneles. |
| Derecha | Inspector: Blink/Diff, épocas, datos y reporte | Columna anclada y desplazamiento vertical propio. |
| Inferior | Cola de cuadrantes, estado y anterior/siguiente | Barra anclada al borde inferior. |

La cuadrícula no se convierte en menús en pantallas pequeñas: conserva una anchura mínima de 1100 px y permite desplazamiento horizontal del documento. Los laterales tienen scroll vertical propio. Este compromiso conserva la posición y disponibilidad de los módulos; requiere revisión visual en dispositivos pequeños.

Reportes y ADN siguen abriéndose en sus diálogos existentes, ahora con superficies opacas. No se añadieron áreas ni se cambiaron contratos, datos, rutas de API o dependencia de Aladin.

## Tipografía

Outfit variable, almacenada localmente como WOFF2, con licencia SIL OFL incluida.

- Títulos de panel y cifras vitales: 800–850.
- Contenido y telemetría: 400; tabulación de cifras para evitar saltos visuales.
- Ayudas/etiquetas: 11–13 px según su función.
- Kodus Pixel ya no se carga en la aplicación.

## Paleta y semántica

| Función | Tema oscuro | Tema claro |
| --- | --- | --- |
| Ink Black / fondo | `#121e23` | `#ecece3` |
| Dark Teal / panel | `#1a2b31` | `#f5f4ec` |
| Ash Grey / texto secundario | `#b2bfbb` | `#4c6566` |
| Air Force Blue / selección | `#2a4653` + borde `#88a9bb` | `#dce9ed` + borde `#567b8e` |
| Deep Saffron / Bronze / acción principal | `#d8a654` | `#8b571f` |
| Beige / datos destacados | `#d9ddcf` | `#dbe3d7` |
| Éxito / limpio | Verde apagado, con texto y etiqueta | Verde apagado, con texto y etiqueta |
| Error | Rojo tierra y mensaje explícito | Rojo tierra y mensaje explícito |

La acción de reporte se distingue por acento cálido; la selección utiliza azul; limpiar utiliza verde. El estado se comunica también con texto, posición y bordes. Los píxeles de las imágenes científicas no se recolorean. Las barras del ADN usan siete colores desaturados diferenciables.

## Archivos para editar

- `src/App.tsx`: composición perimetral y foco entre secciones.
- `src/components/layout/WorkspaceNav.tsx`: accesos directos sin ocultar módulos.
- `src/styles/theme.css`: fuente, tokens de ambos temas, foco y movimiento reducido.
- `src/styles/workspace.css`: marco, cuadrícula, navegación y coordenadas.
- `src/styles/inspector.css`: visor, acciones y ADN.
- `src/styles/compatibility.css`: adaptación temporal de las utilidades anteriores en diálogos y avisos. Al editar esos componentes, preferir clases semánticas y reducir esta capa.
- `src/styles/index.css`: entrada e imports.

## Comprobaciones

- Build de Vite y TypeScript estricto.
- Cálculo de contraste para texto normal, secundario, acción principal, selección, éxito, error, aviso y datos destacados: mínimo 5.29:1 en oscuro y 5.56:1 en claro entre los pares comprobados. No equivale a una auditoría de toda la aplicación.
- Revisión del código: no hay drawers, controles de colapsar paneles, ni reglas responsive que escondan módulos del HUD.
- No se pudo realizar inspección visual de la aplicación: no hay navegador conectado en esta sesión.
