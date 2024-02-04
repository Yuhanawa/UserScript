import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteCompression from 'vite-plugin-compression'
import { cdn } from "vite-plugin-cdn2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cdn({ modules: ["react", "react-dom", "antd"] }),
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240,
      verbose: true, // 是否在控制台中输出压缩结果
      ext: '.gz',
      deleteOriginFile: false
    }),
  ],
  rollupOptions: {
    output: {
      experimentalMinChunkSize: 10 * 1024, // 单位b
      chunkFileNames: 'static/js/[name]-[hash].js', // 代码分割导致的额外的构建产物的文件名
      entryFileNames: 'static/js/[name]-[hash].js', // 打包入口生成的构建结果
      assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // 重命名构建后生成产物的名字
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          return 'vendor'
        }
        return 'index'
      }
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }
  }
})
