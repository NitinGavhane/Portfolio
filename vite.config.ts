import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Native modulepreload is supported by all current browsers; disabling the
    // legacy polyfill avoids a rollup 4.62+ "source phase import" build error.
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Tech-logo path data — large but static; keep it out of the
          // homepage-critical chunk so it loads in parallel and caches on its own.
          if (id.includes('src/lib/techIconPaths')) return 'tech-icons';
          if (id.includes('node_modules')) {
            if (/node_modules\/(react|react-dom|react-router|react-router-dom|@remix-run)\//.test(id)) return 'react-vendor';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('react-datepicker') || id.includes('date-fns')) return 'datepicker';
            if (id.includes('@emailjs') || id.includes('emailjs-com')) return 'email';
          }
        },
      },
    },
  },
});
