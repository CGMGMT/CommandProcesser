import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Required for Railway static build
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
