import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../FSYAPI/wwwroot",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": "https://localhost:7231",
    },
  },
});
