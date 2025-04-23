import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // This enables using '@' as a path alias for the src directory
    },
  },
  // Ensure Vite properly handles TypeScript
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020', // Specify target to ensure proper transpilation
    },
  },
  build: {
    target: 'es2020', // Match the target with optimizeDeps
    outDir: 'dist',
    sourcemap: true, // Enable source maps for debugging
  },
  // Specific options for development server
  server: {
    port: 3000,
    open: true,
    // Uncomment if you need to handle CORS during development
    // cors: true, 
  },
})