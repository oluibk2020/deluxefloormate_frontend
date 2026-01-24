import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Deluxe FloorMate",
        short_name: "DeluxeFloorMate",
        description: "An e-commerce platform for floor mats and home decor",
        theme_color: "#ffd700",
        icons: [
          {
            src: "deluxelogo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "deluxelogo512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "deluxelogo512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
