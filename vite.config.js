import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       
    open: true,       
    proxy: {
      '/api/nextleet': {
        target: 'https://api.nextleet.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nextleet/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Cookie', 'NEXTLEET_SESSION=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTE5Yzc1NTdjMzYzMzljODdjNDk2ZSIsIm5hbWUiOiJQcmF0aGFtZXNoIEphZGhhdiIsImVtYWlsIjoiamFkaGF2cHJhdGhhbWVzaDMxMkBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSTFjenc3WFpWSDc5UkgzZ3g3YUM2dVo4X2hEY2Vzb1hpc0FGNWJxSU5iblRLY2hDQT1zOTYtYyIsImlhdCI6MTc3MTQ0MDgwMCwiZXhwIjoxNzc0MDMyODAwfQ.sGUZYiXw6UujDwcjS-UVLgvxKk-cbd9KJN_LIfhxcdU');
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',   
    emptyOutDir: true 
  }
});