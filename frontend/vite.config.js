import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/The_Wonder_TezzDimag_Abacus_Claasess/',
  plugins: [react(), tailwindcss()],
});
