import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(),
  VitePWA({
    registerType: "autoUpdate",
    includeAssets: [
      "favicon.ico",
      "apple-touch-icon.png",
      "mask-icon.svg"
    ],
    manifest: {
      name: "DevEraa - Abacus",
      short_name: "Dev-Abacus",
      description: "Smart Abacus Learning & Examination App",
      theme_color: "#2563eb",        // blue-600
      background_color: "#ffffff",
      display: "standalone",
      scope: "/",
      start_url: "/",
      orientation: "portrait",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "/pwa-512x512-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ]
    }
  })
  ],
});
