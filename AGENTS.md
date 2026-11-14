# AGENTS.md — SpectraHive-front

Instrucciones para agentes de IA (Antigravity, Claude Code, Codex, Cursor, etc.).
`CLAUDE.md` y `GEMINI.md` solo apuntan a este archivo.

## Qué es este repo

**Este repo es solo el módulo frontend de SpectraHive** (SPHEREx Tracker), proyecto de ciencia
ciudadana para el NASA Space Apps Challenge 2026 (*Planet X and SPHEREx*). El proyecto completo
tiene además backend (FastAPI), base de datos (Supabase) y entrega/demo, a cargo de otros
integrantes/repos. Aquí solo se construye la **cara del proyecto** (Rol 01).

Flujo central (no se toca): buscar por RA/Dec → Blink Época A ↔ B → resta |B−A| → reportar
anomalía → ADN Cósmico → validación cruzada.

## Lee primero (en este orden)

1. [`docs/spec/00-contexto-general.md`](docs/spec/00-contexto-general.md) — **fuente única de verdad**
   (RF, RN, modelo de datos, objetos de prueba, contratos de API). Si algo choca con él, él manda.
2. [`docs/roles/01-frontend-blink.md`](docs/roles/01-frontend-blink.md) — tu rol: entregables, orden y "listo".
3. Solo si hace falta: `docs/roles/02-…` (backend), `03-…` (DB/ADN), `04-…` (entrega) y
   [`docs/proposal/`](docs/proposal/) (propuesta original en PDF y transcripción `.md`; es guía, no entregable).

> Los docs mencionan rutas `../spectrahive-starter-kit/…` y `../spherex-tracker-propuesta-corregida/…`
> que **no existen en este repo** (viven en otro lugar del proyecto). No las inventes: pide el archivo al humano.

## Stack (congelado — no cambiar)

Vite + React + **TypeScript** + Tailwind CSS + Aladin Lite (por CDN). Despliegue en Vercel (build estático).
Docker + Docker Compose para desarrollo/pruebas locales (RF-17, RN-13). El frontend **no** habla
con Supabase ni escribe SQL: solo llama a la API del backend (`VITE_API_BASE_URL`).

## Estructura de directorios

```
SpectraHive-front/
├── AGENTS.md / CLAUDE.md / GEMINI.md   # contexto para agentes
├── README.md                           # visión general + declaración de uso de IA
├── .env.example                        # variables (VITE_*), sin secretos
├── docs/
│   ├── spec/                           # 00-contexto-general.md (fuente de verdad)
│   ├── roles/                          # 01–04: contexto por rol
│   └── proposal/                       # propuesta PDF + transcripción .md
├── public/                             # estáticos (favicon, cutouts/demos precalculados)
├── src/
│   ├── assets/                         # imágenes/iconos propios (sin logos NASA)
│   ├── components/
│   │   ├── layout/                     # shell, header, navegación de cola de cuadrantes
│   │   ├── ui/                         # primitivas reutilizables (botón, toggle, badge…)
│   │   ├── search/                     # buscador RA/Dec, selector FOV 1|2, atajos de los 5 objetos
│   │   ├── blink/                      # visor Aladin Lite, blink A↔B, vista de resta |B−A|
│   │   ├── report/                     # reportar anomalía / marcar limpio, estado de validación
│   │   └── adn/                        # ADN Cósmico (código de barras)
│   ├── hooks/                          # hooks (p. ej. useUrlState, useBlink)
│   ├── lib/                            # utilidades puras (parseo/validación RA-Dec, URL, constantes)
│   ├── pages/                          # vistas/rutas
│   ├── services/                       # cliente de la API: /cutout, /diff, /report
│   ├── types/                          # tipos/contratos (cuadrante, reporte, ADN…)
│   ├── data/                           # datos estáticos: catálogo de 5 objetos, ADN precalculado
│   └── styles/                         # CSS global / config Tailwind
└── tests/                              # pruebas
```

Al añadir código, respeta esta estructura. El andamio ya existe (Vite 8 + React 19 + Tailwind 4, **TypeScript/`.tsx`**):
`package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` (carga Aladin Lite por CDN), `src/main.tsx`, `src/App.tsx`,
`src/vite-env.d.ts`, `src/styles/index.css` y `Dockerfile` (solo desarrollo/pruebas, RN-13). El `docker-compose.yml` (servicios
`frontend`, `backend`, `db-local`) es del repo de integración — confirma con el humano dónde vive.

## Convenciones React

- **React con Vite** (SPA, sin SSR ni Next.js). Solo componentes de función y hooks; sin componentes de clase.
- Un componente por archivo, nombre en `PascalCase` (`BlinkViewer.tsx`); hooks en `hooks/` con prefijo `use`
  (`useUrlState`, `useBlink`); utilidades puras (parseo RA/Dec, validación, URL) en `lib/`, sin React.
- Los componentes solo presentan: la lógica de dominio va en `lib/` o hooks, y las llamadas HTTP solo en `services/`
  (nunca `fetch` dentro de un componente).
- Estado local con `useState`/`useReducer`; el estado de ubicación (`ra`, `dec`, `fov`) vive en la URL (RF-03).
  Sin librerías de estado global ni de rutas/UI nuevas sin avisar (es dependencia nueva → RN-14 si afecta el stack).
- Aladin Lite se carga por CDN y se integra en un componente/hook propio (`components/blink/`), limpiando en el
  desmontaje (`useEffect` cleanup) para no duplicar instancias.
- **TypeScript estricto** (`strict: true`): sin `any` implícito ni `// @ts-ignore`. Los contratos de la API (§6 del spec)
  y el modelo de datos se tipan en `types/` y se reutilizan en `services/`, hooks y componentes. Props tipadas con
  `interface`/`type`; variables de entorno tipadas en `src/vite-env.d.ts`. Aladin Lite (global por CDN) se tipa en
  `types/` (declaración mínima propia, sin dependencias nuevas).
- Estilos con Tailwind (clases utilitarias); CSS propio solo en `styles/`.
- Textos de UI en inglés; accesibilidad básica (`alt`, `aria-label`, foco visible en controles del blink).

## Reglas que no se negocian

- **UI y textos de usuario en inglés.** El español queda solo para docs internos.
- **Alcance MVP (RN-11):** sin HiPS propio, sin red social/perfiles/leaderboard, máx. **2 épocas**, **un solo**
  falso color (percentiles 1–99), **FOV solo 1 y 2** (sin slider continuo), sin extracción de 102 bandas en vivo.
- **Los 5 objetos** se llaman "los 5 objetos que el reto pide probar", nunca "exigidos/obligatorios" (RN-01).
  Usa **solo** las coordenadas de `docs/spec/00-contexto-general.md` §5 (J2000). No inventes coordenadas ni datos.
- **Dos grupos, no mezclar:** movimiento (Barnard, Epsilon Indi B, WISE 0855) y brillo (RW Aurigae, R Draconis).
  Brillo ≠ movimiento (RN-02/03): explícalo así en la UI.
- **ADN Cósmico = firma visual**, nunca "identificación química" (RF-15). Datos precalculados, no se calculan en el front.
- **Votos simulados:** siempre etiquetados como simulados en la UI (RF-13).
- **URL dinámica (RF-03):** `/?ra=<RA>&dec=<Dec>&fov=<1|2>` debe abrir centrado y se actualiza al cambiar de cuadrante.
  RA 0–360°, Dec −90…+90°; rechazar fuera de rango con mensaje claro (RF-01).
- **Contratos de API (§6 del spec):** `GET /cutout`, `POST /diff`, `POST /report`. No cambiarlos por tu cuenta.
- **Sin logos NASA ni identificadores de misión** como imagen/logo. Imágenes/video generados con IA: marca de agua visible.
- **Secretos:** nada de credenciales/tokens en el repo ni en prompts. Variables en `.env` (ignorado por git).

## Cambio sustancial (RN-14) — detente y avisa

Si hace falta cambiar el stack, un RF/RN, un contrato de API, el modelo de datos, el alcance, los objetos de
prueba o el entorno Docker: **NO lo implementes**. Avisa al humano en el chat (qué cambia, por qué, qué afecta),
espera a que el equipo lo acuerde; entonces se actualiza primero `docs/spec/00-contexto-general.md` y después se
implementa. Bugs, estilos y correcciones que no tocan RF/RN/contratos/datos se hacen directo.

## Código asistido por IA (RN-12)

Cada archivo generado/asistido lleva en la cabecera:

```ts
// Assisted by <herramienta> (SI) — reviewed by <nombre>
```

y se anota en el README (sección "Use of Super Intelligence"). Se declara en la entrega.

## Comandos

- `npm install` · `npm run dev` (http://localhost:5173) · `npm run typecheck` · `npm run build` (incluye typecheck) · `npm run preview`
- Docker (RF-17, con el compose del repo de integración): `docker compose up --build` / `docker compose up frontend` / `docker compose down`.
- Build local de la imagen: `docker build -t spectrahive-front .` y `docker run -p 5173:5173 spectrahive-front`.

## "Listo" para este módulo

Blink real con Barnard, buscador + URL dinámica, resta visible con umbral explicado, reporte que llega a la DB
vía API, ADN Cósmico visible, UI en inglés y app desplegada en Vercel (link público sin login).
