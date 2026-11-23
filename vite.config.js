import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Two pages: the book world (index.html) and the admin page (admin.html).
      input: { main: 'index.html', admin: 'admin.html' },
    },
  },
  server: {
    // In development the API runs on :3001 (npm run dev starts both).
    proxy: { '/api': 'http://localhost:3001' },
  },
});
