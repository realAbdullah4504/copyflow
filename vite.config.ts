import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(),tsconfigPaths()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
