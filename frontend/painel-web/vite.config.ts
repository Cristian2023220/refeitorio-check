import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: { port: 5502 },
  preview: { port: 5502 },
  plugins: [react()],
});
