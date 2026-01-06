import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // Optimize build performance
    minify: 'esbuild', // Faster than terser
    target: 'esnext',
    sourcemap: false, // Disable sourcemaps for faster builds
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep React and React-DOM together - DO NOT split them
          // This is critical to prevent "Cannot set properties of undefined" errors
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Put react-router-dom in react-vendor chunk (depends on React)
          if (id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          // Put recharts in its own chunk
          if (id.includes('node_modules/recharts')) {
            return 'chart-vendor';
          }
          // Put lucide-react in its own chunk
          if (id.includes('node_modules/lucide-react')) {
            return 'ui-vendor';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
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
