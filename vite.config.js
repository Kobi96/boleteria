import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/tesi-api": {
        target: "https://tesi.sanisidro.gob.ar/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tesi-api/, ""),
        secure: false,
      },
    },
  },
});
