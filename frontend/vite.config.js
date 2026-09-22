import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const oauthHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    strictPort: true,
    headers: oauthHeaders,
  },

  preview: {
    headers: oauthHeaders,
  },
});
