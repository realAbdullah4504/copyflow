import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {visualizer} from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), tailwindcss(),tsconfigPaths(),visualizer({
      filename: "bundle-report.html",
      gzipSize: true,
      brotliSize: true,
      open: true, // auto-open in browser
    }),],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
