import { copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      writeBundle() {
        const source = resolve(rootDir, '.htaccess')
        const destination = resolve(rootDir, 'dist', '.htaccess')

        if (existsSync(source)) {
          copyFileSync(source, destination)
        }
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: './src/test/setup.js',
    css: false,
  },
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

          if (id.includes('three')) {
            return 'three'
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
