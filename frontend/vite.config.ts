import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/docs": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/customers": "http://localhost:3000",
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
});
