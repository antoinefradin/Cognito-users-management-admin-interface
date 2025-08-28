import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import tsconfigPaths from 'vite-tsconfig-paths'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),tsconfigPaths()], // ← Lit automatiquement tsconfig.json paths
  server: {
    port: 5173,
      strictPort: true,
  },
  resolve: {
    alias: {
      '@/@types': path.resolve(__dirname, './src/@types'),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
