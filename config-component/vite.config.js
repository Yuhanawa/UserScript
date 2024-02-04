import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteCompression from 'vite-plugin-compression'
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression(),
    importToCDN({
      modules: [
        autoComplete('react'),
        autoComplete('react-dom'),
        // autoComplete('antd'),
      ],
    })
  ],
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
        assetFileNames: 'assets/css/[name].[ext]',
        manualChunks: (id, { getModuleInfo }) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (getModuleInfo(id).importers.length > 1) {
            return 'common';
          }
          return 'index'
        }
      }
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }
})
