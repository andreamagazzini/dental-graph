import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Use '/dental-graph/' for GitHub Pages subdomain
export default defineConfig({
  plugins: [react()],
  base: '/dental-graph/',
})
