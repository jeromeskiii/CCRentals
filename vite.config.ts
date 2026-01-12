import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Warn in development if variables are missing
  const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  if (mode !== 'production') {
    const missing = requiredEnvVars.filter((key) => !env[key]);
    if (missing.length > 0) {
      console.warn('⚠️  Missing environment variables:', missing.join(', '));
    }
  }

  return {
    server: {
      port: 3000,
      host: true, // Listen on all addresses (0.0.0.0)
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(fileURLToPath(new URL('.', import.meta.url))),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split animation libraries into separate chunks
            'framer-motion': ['framer-motion'],
            gsap: ['gsap'],
            // Split React into its own chunk
            react: ['react', 'react-dom'],
            // Split Supabase client
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
  };
});
