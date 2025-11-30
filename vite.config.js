import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/profile": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
      "/dashboard": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
      "/transactions": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
      "/cards": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
  },
});
