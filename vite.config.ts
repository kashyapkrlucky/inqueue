import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'vendor-react'
          }

          if (id.includes('react-router')) {
            return 'vendor-router'
          }

          if (id.includes('lucide-react')) {
            return 'vendor-icons'
          }

          if (
            id.includes('axios') ||
            id.includes('zustand') ||
            id.includes('react-hot-toast')
          ) {
            return 'vendor-app'
          }

          return 'vendor-misc'
        },
      },
    },
  },
})
