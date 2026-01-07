import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Warn in development if variables are missing
    const requiredEnvVars = ['GEMINI_API_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    if (mode !== 'production') {
        const missing = requiredEnvVars.filter(key => !env[key]);
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
      define: {
        // Only shim process.env for libs that might need it
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || 'dev-mode-placeholder'),
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, '.'),
        }
      }
    };
});
