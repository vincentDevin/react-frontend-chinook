// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    build: {
      sourcemap: mode === 'development', // Enable source maps only in development mode
    },
    test: {
      globals: true, // Use global methods like 'describe', 'it', 'test' without importing them
      environment: 'jsdom', // Simulate browser environment
      setupFiles: './src/setupTests.js', // Path to setup file (can be .js or .ts based on your preference)
    },
  };
});
