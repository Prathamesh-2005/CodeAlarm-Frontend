import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // Default development port
    open: true        // Automatically open browser
  },
  build: {
    outDir: 'dist',   // Production build output directory
    emptyOutDir: true // Clear the directory before building
  }
});