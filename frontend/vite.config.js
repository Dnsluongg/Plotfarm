import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  envDir: resolve(__dirname, '..'),
  plugins: [react()],
  server: { host: '127.0.0.1' },
  build: { outDir: resolve(__dirname, '../dist'), emptyOutDir: true }
})
