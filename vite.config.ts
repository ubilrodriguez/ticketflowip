// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy all API requests to avoid CORS issues during development
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Uncomment this if API doesn't have /api prefix at the server side
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})