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
| _por completar_ | | |
