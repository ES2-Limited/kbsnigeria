import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      writeBundle() {
        const source = resolve(__dirname, '.htaccess')
        const destination = resolve(__dirname, 'dist', '.htaccess')

        if (existsSync(source)) {
          copyFileSync(source, destination)
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('@tiptap')) {
            return 'editor'
          }

          if (id.includes('@supabase')) {
            return 'supabase'
          }

          if (id.includes('framer-motion')) {
            return 'motion'
          }

          if (
            id.includes('react-dom') ||
            id.includes('react-router-dom') ||
            id.includes('react-helmet-async') ||
            id.includes('/react/')
          ) {
            return 'react-vendor'
          }

          return undefined
        },
      },
    },
  },
})
