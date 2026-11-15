import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: false },
      '/oauth': { target: 'http://localhost:8000', changeOrigin: false },
      '/admin': { target: 'http://localhost:8000', changeOrigin: false },
      '/static': { target: 'http://localhost:8000', changeOrigin: false },
    },
  },
})