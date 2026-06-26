import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// brand_assets is served at the web root (e.g. /background/background1.avif,
// /product_images/product_image_1.avif). Single source of truth, no copy step.
export default defineConfig({
  plugins: [react()],
  publicDir: 'brand_assets',
  server: { port: 3000 },
});
