import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    mode === "development" && false && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    port: 8080,
  },
}));
