import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backend = { target: 'http://localhost:8000', changeOrigin: false }

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backend,
      '/oauth': backend,
      '/admin': backend,
      '/static': backend,
    },
  },

  build: { outDir: 'build' },
})
