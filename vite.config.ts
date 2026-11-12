import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
// GitHub Pages serves this project site from /Embedded-quiz/, so production
// builds use that base path while the local dev server stays at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Embedded-quiz/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // The combined 30-item UI flows type/click through many screens, which
    // exceeds Vitest's 5s default on slower machines.
    testTimeout: 20000,
  },
}))
