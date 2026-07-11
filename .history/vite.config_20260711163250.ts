import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/todoflow/", // Название репозитория
  server: {
    port: 3000,
  },
});
