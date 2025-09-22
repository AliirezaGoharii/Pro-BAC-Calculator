import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/Pro-BAC-Calculator/', 
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
})

