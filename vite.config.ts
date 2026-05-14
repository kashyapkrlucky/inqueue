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
  // build: {
  //   rollupOptions: {
  //     output: {
  //       // Better chunk splitting
  //       chunkFileNames: 'assets/chunk-[name]-[hash].js',
  //       entryFileNames: 'assets/entry-[name]-[hash].js',
  //       assetFileNames: 'assets/[name]-[hash][extname]',
  //       // Optimize chunking - keep React with vendor libraries to avoid forwardRef errors
  //       manualChunks: (id) => {
  //         if (id.includes('node_modules')) {
  //           if (id.includes('lucide')) {
  //             return 'ui';
  //           }
  //           if (id.includes('tailwind')) {
  //             return 'styles';
  //           }
  //           return 'vendor';
  //         }
  //       }
  //     }
  //   },
  //   sourcemap: false,
  //   // Enable CSS code splitting
  //   cssCodeSplit: true,
  //   // Set chunk size warning limit
  //   chunkSizeWarningLimit: 1000
  // },
})
