import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El sitio vive bajo /capbroker-demo/ para no tocar la raíz.
export default defineConfig({
  base: '/capbroker-demo/',
  plugins: [react()],
})
