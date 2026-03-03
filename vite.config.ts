import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment: set base to your repo name
  // e.g., base: '/your-repo-name/'
  // For custom domain or root deployment, use base: '/'
  base: './', // Relative base for GitHub Pages
})
