import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
      config: "/src/config",
      constants: "/src/constants",
      contexts: "/src/contexts",
      hooks: "/src/hooks",
      operations: "/src/operations",
      screens: "/src/screens",
      types: "/src/types",
      utils: "/src/utils",
    },
  },
  server: {
    port: 3000
  }
})
