import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({ root: resolve(__dirname, 'ui'), plugins: [react()], server: { port: 8790, host: '127.0.0.1', proxy: { '/api': 'http://127.0.0.1:8787', '/health': 'http://127.0.0.1:8787' } }, build: { outDir: resolve(__dirname, 'dist'), emptyOutDir: true } })
