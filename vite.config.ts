import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      tailwindcss(),
      // Add istanbul for code coverage in test mode
      mode === 'test' &&
        istanbul({
          include: ['**/*.{ts,tsx}'],
          exclude: ['node_modules', 'e2e', '**/*.spec.ts', '**/*.test.ts'],
          requireEnv: false,
        }),
    ].filter(Boolean),
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
