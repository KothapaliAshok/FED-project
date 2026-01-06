import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  base: '/',
  build: {
    // Optimize build performance
    minify: 'esbuild', // Faster than terser
    target: 'esnext',
    sourcemap: false, // Disable sourcemaps for faster builds
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize dependencies - transform CommonJS to ESM
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      defaultIsModuleExports: true,
      requireReturnsDefault: 'auto',
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'lucide-react', 'zustand', 'date-fns'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
