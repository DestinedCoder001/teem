import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react-modern-drawer"],
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
    allowedHosts: ["2b2f91d6f84c.ngrok-free.app"],
  },
});
