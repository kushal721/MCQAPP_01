import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Fail instead of silently moving to another port when 5173 is taken.
    strictPort: true,
    // Also listen on the network address so other devices can open it.
    host: true,
  },
});
