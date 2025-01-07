import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sass from "sass";

export default defineConfig({
  base: "/OGY-Monday/", // Replace with your repository name
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
