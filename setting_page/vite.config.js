import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 列出所有的入口文件
        main: path.resolve(__dirname, 'index.html'),
        // 添加其他入口文件，例如：
        // about: path.resolve(__dirname, 'about.html'),
        // contact: path.resolve(__dirname, 'contact.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    sourcemap: false, // 禁用 sourcemap
    // minify: false, // 禁用压缩
  },
  
})