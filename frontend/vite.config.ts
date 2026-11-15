import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Lokalno Vite prosljeđuje pozive backendu, pa su frontend i backend na istoj adresi (kao iza nginxa).
// changeOrigin: false čuva adresu frontenda, pa se Google nakon prijave vraća na frontend, a ne na :8000.
const backend = { target: 'http://localhost:8000', changeOrigin: false }

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backend,
      '/oauth': backend,
      '/admin': backend,
    },
  },
  // nginx/Dockerfile kopira frontend/build
  build: { outDir: 'build' },
})
