<!-- Assisted by Codex (SI) — reviewed by pendiente -->

# Referencias de diseño UI para SpectraHive

**Revisión:** 14 de noviembre de 2026.
**Alcance:** proyectos de diseño publicados en Behance y Dribbble. Se priorizan interfaces astronómicas, observatorios, telescopios y visualización científica. Son referencias visuales/conceptuales; no se presentan como software científico operativo.

## Referencias principales

### 1. Spaceflux — producto web de observación espacial

[Abrir el caso de Spaceflux en Behance](https://www.behance.net/gallery/183406451/Spaceflux-Website-and-UIUX-for-Space-Company)

Caso de estudio para una compañía de observación espacial con telescopios ópticos. Incluye un dashboard de acceso a secciones y una vista de red de sensores con ubicaciones y estados. Es la referencia de dominio más cercana para pensar navegación, mapas e información de estado. El caso usa fondos oscuros, acentos violetas y recursos 3D; conviene estudiar la organización del producto y seleccionar con cuidado qué elementos gráficos adoptar.

### 2. Phaenomena — aplicación de datos de estrellas y constelaciones

[Abrir Phaenomena en Behance](https://www.behance.net/gallery/44577591/Phaenomena-Stars-Constellations-Data-Visualization)

Visualización web de estrellas y constelaciones. El caso presenta búsqueda, zoom, información por estrella, magnitud y movimiento propio a través del tiempo. Aporta ideas de cómo combinar una vista espacial con atributos medibles. Es un proyecto de 2016; usarlo como antecedente de interacción y lectura de datos, no como patrón visual contemporáneo.

### 3. HALATION — archivo interactivo de un observatorio ficticio

[Abrir HALATION en Behance](https://www.behance.net/gallery/254706455/HALATION-Interactive-Archive-Data-System)

Sistema editorial/responsivo que organiza objetos en un catálogo filtrable, fichas individuales y estados de señal. La descripción del caso explica varias vistas de una misma colección y su adaptación entre escritorio y móvil. Es un concepto, no un observatorio real; resulta útil para estudiar jerarquía y ritmo visual sin asumir que sus efectos WebGL sirven para el flujo científico de SpectraHive.

### 4. NOCTRA — identidad y sitio de observatorio

[Abrir NOCTRA en Behance](https://www.behance.net/gallery/248063485/NOCTRA-Observatory-Website-Design-UXUI)

Proyecto de web e identidad para observatorio/planetario, planteado desde una narrativa sobre el cielo nocturno. Sus pantallas combinan títulos serif pixelados con texto monoespaciado, fondo negro e imágenes de archivo. Puede inspirar tipografía, composición y tono editorial. Es principalmente una referencia de presentación de marca, no del espacio de trabajo de análisis.

### 5. Space Education Dashboard — panel educativo de astronomía

[Abrir Space Education Dashboard en Dribbble](https://dribbble.com/shots/27419729-Space-Education-Dashboard-UI-Design-for-Solar-System-Explorer)

Concepto de dashboard con contenido astronómico, navegación interactiva y composición editorial para explicar datos. Es útil para revisar cómo dar contexto a información científica y hacerla legible para principiantes. Está enfocado en educación del sistema solar, no en comparar imágenes de investigación.

### 6. Hestia — aplicación de telescopio inteligente

[Abrir Hestia en Dribbble](https://dribbble.com/shots/25479265-Hestia-Smart-Telescope-Mobile-App)

Concepto de app móvil para manejo de telescopio, mapas de cielo, alineación y seguimiento de objetos. Sirve para examinar controles guiados y simplificación de una tarea técnica. Es móvil y depende de hardware; tomar solo patrones de orientación y presentación del estado.

## Referencias complementarias

- [Space app / Stellar View en Behance](https://www.behance.net/gallery/196835987/Space-app-UXUI-Design?locale=en_US): descubrimiento de objetos visibles y eventos astronómicos; referencia móvil de navegación y detalle de objeto.
- [LookUp, concepto de mapa astronómico en Behance](https://www.behance.net/gallery/55331075/UI-design-concept-astronomy-app-LookUp): inspiración de carta celeste y lenguaje gráfico de atlas; concepto antiguo, no dashboard de producto.
- [Aster, app de observación en Behance](https://www.behance.net/gallery/174122845/Aster): concepto breve con pantallas de astronomía, dashboard y visualización de datos; útil para ideas puntuales, no para basar arquitectura.
- [Galería de astronomy UI en Dribbble](https://dribbble.com/search/astronomy-ui): búsqueda amplia para descubrir tratamientos visuales. Revisar cada proyecto individualmente; los resultados mezclan astronomía, astrología, ilustración, landing pages y conceptos sci-fi.

## Tipografía elegida para acercarse a NOCTRA

- [Kodus Pixel](https://github.com/kodustech/kodus-pixel): serif pixelada de licencia SIL OFL 1.1, con soporte para caracteres españoles. La fuente se guarda localmente en `public/fonts/`; se limita a títulos y rótulos cortos para conservar la legibilidad de coordenadas y explicaciones.
- La referencia NOCTRA inspira la dirección; Kodus Pixel es un recurso tipográfico independiente elegido para lograr un tratamiento pixel-serif similar. No se afirma que sea la fuente original del proyecto.

## Qué patrones sí se trasladan a SpectraHive

| Necesidad de la interfaz | Referencias útiles | Patrón que se puede estudiar |
| --- | --- | --- |
| Mantener mapa e inspector conectados | Spaceflux, Phaenomena | Ubicación/contexto visible, datos asociados cerca y navegación clara entre vista general y detalle. |
| Enseñar a interpretar la observación | Space Education Dashboard, Hestia | Ayuda contextual breve, controles con nombres comprensibles y orientación junto a la tarea. |
| Dar identidad astronómica sin disfraz de “sci-fi” | HALATION, NOCTRA, LookUp | Tipografía, composición editorial, catálogo y detalles gráficos contenidos. |
| Presentar los objetos y sus datos | HALATION, Phaenomena, Stellar View | Un elemento seleccionado, ficha legible y atributos alineados con la vista principal. |

## Criterio recomendado para el rediseño

- Usar el lienzo del cielo como contexto y mantener separado el cutout SPHEREx donde ocurre la comparación Blink/Diff.
- Poner la tarea en primer plano: seleccionar objeto, revisar épocas A/B, inspeccionar la resta y reportar.
- Dar prioridad a superficies legibles, divisores y una jerarquía de texto clara. Evitar reproducir glassmorphism, halos, retículas decorativas y estética de centro de mando, aunque aparezcan en referencias espaciales populares.
- Extraer la identidad de detalles de atlas/archivo astronómico y no depender de una imagen de nebulosa como fondo de toda la aplicación.
- Tratar los ejemplos móviles como inspiración de microcopy y orientación, no como distribución para escritorio.
- Conservar contratos, datos, límites y nombres definidos en `docs/spec/00-contexto-general.md`; las referencias no autorizan cambios funcionales.

## Fuentes consultadas y límites

Los enlaces principales apuntan a páginas individuales de proyectos en Behance o Dribbble, no a páginas de productos científicos ni a documentación técnica. Se consultaron sus descripciones y se comprobó que las páginas de HALATION, Stellar View y el resultado de Dribbble para Hestia se podían abrir durante esta revisión. El acceso de lectura automatizada de algunas páginas Behance puede devolver una denegación 403 aunque la página del proyecto aparezca indexada; si un enlace no abre en tu navegador, usa el título para buscarlo dentro de Behance.

La búsqueda de Mobbin no se pudo completar: el MCP informó que el plan conectado requiere una suscripción de pago. No se reutilizó como si los resultados de Mobbin hubieran sido consultados.
