# SpectraHive — Frontend

Módulo frontend de **SpectraHive (SPHEREx Tracker)**, plataforma de ciencia ciudadana para el
NASA Space Apps Challenge 2026 — *Planet X and SPHEREx*. Este repo contiene solo la interfaz
(Vite + React + Tailwind + Aladin Lite); el backend (FastAPI), la base de datos (Supabase) y la
entrega viven en otros módulos del proyecto.

Flujo: buscar por RA/Dec → Blink Época A ↔ B → resta |B−A| → reportar anomalía → ADN Cósmico → validación cruzada.

## Documentación

| Qué | Dónde |
| --- | --- |
| Requisitos, reglas, contratos (fuente de verdad) | [docs/spec/00-contexto-general.md](docs/spec/00-contexto-general.md) |
| Contexto por rol (01 = este módulo) | [docs/roles/](docs/roles/) |
| Propuesta original | [docs/proposal/](docs/proposal/) |
| Dirección visual y mapa de estilos vigente | [docs/diseno-minimalismo-tactico.md](docs/diseno-minimalismo-tactico.md) |
| Guía para agentes de IA | [AGENTS.md](AGENTS.md) |

## Estructura

Ver el árbol comentado en [AGENTS.md](AGENTS.md#estructura-de-directorios).

## Configuración

```bash
cp .env.example .env   # ajusta VITE_API_BASE_URL
npm install
npm run dev            # http://localhost:5173
npm run typecheck
```

Stack: Vite + React + TypeScript + Tailwind CSS + Aladin Lite (CDN). Build estático: `npm run build`.

## Use of Super Intelligence (SI)

Declaración de herramientas de IA usadas en este módulo (se reporta en la entrega):

| Herramienta | Para qué | Revisado por |
| --- | --- | --- |
| Codex | Análisis de arquitectura y mapa para agentes en `docs/resumen-arquitectura-frontend.md` | pendiente |
| Codex | Plan de implementación del tutorial guiado en `docs/plan-tutorial-guiado.md` | pendiente |
| Codex | Investigación de referencias y dirección para el rediseño en `docs/investigacion-referencias-redisenio.md` | pendiente |
| Codex | Mockups de tres direcciones visuales en `docs/visuals/opciones-estilo.html` | pendiente |
| Codex | Tema NOCTRA: superficies rectas, paleta desaturada y tipografía pixel-serifa Kodus Pixel en títulos | pendiente |
| Codex | Nueva distribución del workspace: navegación lateral, paneles contextuales, cola numerada y transiciones con movimiento reducido | pendiente |
| Codex | Iconografía Lucide React en navegación, inspector, reportes y ADN; eliminación de emojis de la interfaz | pendiente |
| Codex | Revisión NOCTRA: jerarquía tipográfica, Inspector integrado, controles centrados, temas claro/oscuro persistentes y lectura de bandas ADN | pendiente |
| Codex | Marco perimetral de ingeniería, paneles desplegados, Outfit local, temas tácticos y estilos organizados por módulo | pendiente |
| _por completar_ | | |
