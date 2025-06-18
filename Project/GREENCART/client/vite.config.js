import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000', // adjust to your backend
    }
  },
  build: {
    rollupOptions: {
      input: '/index.html'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
