<!-- Assisted by Codex (SI) — reviewed by pendiente -->

# Revisión de identidad y jerarquía del HUD

> Documento histórico. La dirección vigente está en [diseno-minimalismo-tactico.md](diseno-minimalismo-tactico.md).

## Evidencia visual revisada

Se inspeccionaron las láminas de programas e identidad de [NOCTRA, de Maria Knyazeva](https://www.behance.net/gallery/248063485/NOCTRA-Observatory-Website-Design-UXUI), también publicado en [Dprofile](https://dprofile.ru/case/177629/noctra-observatory-website-design-uxui).

La lámina de programas muestra títulos serif pixelados grandes e inclinados, navegación monoespaciada pequeña, superficies negras y marfil, separadores finos y acciones rectangulares claras. La lámina de identidad describe explícitamente la combinación pixel serif + monospace. La fuente original no está identificada en estas láminas; Kodus Pixel es la sustituta local elegida, no una reproducción exacta de esa fuente.

## Aplicación al producto

- `HudHeader`: marca serif, cambio claro/oscuro visible y segunda fila con controles de capa y FOV centrados. El objeto activo se presenta a la izquierda cuando hay espacio.
- `BlinkViewer`: nombre del objeto como título principal; selector de modo con subrayado, imagen y reproducción contiguas, franja clara con RA/Dec etiquetadas y acción principal contrastada. Los controles manuales A/B pausan la reproducción para permitir examinar la época elegida.
- `DiffViewer`: resumen con cantidad de candidatos y umbral real del servicio, filas de candidatos y explicación desplegable. Las imágenes conservan sus píxeles y el indicador de fuente sintética.
- `CosmicDnaViewer`: gráfico de bandas coloreadas y tabla que asocia cada longitud de onda a su flujo normalizado. Los valores siguen siendo los datos precalculados; se reduce la decoración y se evita la lectura de números sueltos.
- `useTheme`: preferencia local persistente, valor inicial oscuro y funcionamiento en memoria si el navegador bloquea almacenamiento.
- `styles/index.css`: tokens por tema, títulos de mayor escala, franja de contraste y tipografía de datos. La imagen científica usa una superficie oscura constante en ambos temas.

## Criterios para próximas ediciones

Conservar tres niveles: título editorial, datos destacados y etiquetas/ayuda. Usar el blanco o marfil para destacar bloques completos de información, no recuadrar cada cifra. Mantener acciones junto a aquello que controlan. Reservar la serif pixelada para títulos; coordenadas, unidades y explicaciones permanecen legibles en monoespaciada. Mantener iconos Lucide, esquinas rectas y movimiento reducido.

## Verificación

`npm run build` comprueba TypeScript y compilación estática. La revisión del código y de las imágenes de referencia no sustituye la inspección del resultado en un navegador; no se ha validado visualmente la aplicación en esta sesión.
