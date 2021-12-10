import { join } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
dotenv.config()
// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, '../src/renderer'),
  plugins: [vue()],
  base: './',
  build: {
    target: 'modules',
    emptyOutDir: true,
    outDir: '../../dist/renderer',
  },
  server: {
    port: Number(process.env.PORT),
  },
})
