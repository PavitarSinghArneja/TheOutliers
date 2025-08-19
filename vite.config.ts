import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // 👈 Simple path alias without Node's path module
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
