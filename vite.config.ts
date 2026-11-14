// Assisted by Antigravity (SI) — reviewed by TBD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // 0.0.0.0 so the dev server is reachable from Docker (RF-17)
    port: 5173,
    strictPort: true,
    watch: { usePolling: true }, // reliable hot reload on bind mounts
  },
})

