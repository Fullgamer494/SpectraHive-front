<!-- Assisted by Codex (SI) — reviewed by pendiente -->

# Workspace oscuro centrado en el mapa

Dirección vigente desde la revisión del workspace: fondo negro y grafito, mapa como superficie dominante y lecturas del HUD explicadas con lenguaje directo. Sustituye la cuadrícula anterior; conserva el flujo científico definido en `docs/spec/00-contexto-general.md`.

## Distribución conservada

| Zona | Contenido | Comportamiento |
| --- | --- | --- |
| Superior | Marca, objeto activo, capa de cielo, FOV y tema | Una franja compacta; libera altura para el mapa. |
| Izquierda | Accesos, cinco objetos y coordenadas | Rail estrecho y panel de lectura compacto; conserva todos los puntos de acceso. |
| Centro | Aladin, instrucciones de navegación y coordenadas del centro | Columna flexible dominante; más ancho disponible para arrastrar y explorar. |
| Derecha | Inspector: Blink/Diff, épocas, datos y reporte | Panel estrecho con desplazamiento propio y superficies oscuras, también al activar tema claro. |
| Inferior | Cola, estado del campo y anterior/siguiente | Barra compacta y anclada al borde inferior. |

Los módulos conservan sus zonas y permanecen visibles. La barra superior se reduce a una fila, el rail y los laterales ocupan menos ancho y el mapa toma el espacio restante. En pantallas menores a 1080 px se mantiene desplazamiento horizontal; los laterales tienen scroll vertical propio.

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
| Ink Black / fondo | `#090d10` | `#ecece3` |
| Graphite / panel | `#11171b` | `#f5f4ec` |
| Ash Grey / texto secundario | `#aab4b7` | `#4c6566` |
| Air Force Blue / selección | `#1c3039` + borde `#718b96` | `#dce9ed` + borde `#567b8e` |
| Bronze / acción principal | `#c8a767` | `#8b571f` |
| Inspector y datos | Siempre oscuro (`#171f23`) | Siempre oscuro (`#171f23`) |
| Éxito / limpio | Verde apagado, con texto y etiqueta | Verde apagado, con texto y etiqueta |
| Error | Rojo tierra y mensaje explícito | Rojo tierra y mensaje explícito |

El tema oscuro es el predeterminado. La acción de reporte se distingue por bronce; la selección utiliza azul; limpiar utiliza verde. El HUD aclara que RA es posición este-oeste, Dec norte-sur, la lectura bajo el cursor cambia al moverlo y el punto elegido alimenta el reporte. El estado se comunica también con texto y bordes. Los píxeles de las imágenes científicas no se recolorean.

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
