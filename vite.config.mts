import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    clearMocks: true,
    include: ['**/*.spec.ts'],
    reporters: ['verbose'],
    testTimeout: 120000,
    coverage: {
      enabled: false,
      all: false,
      provider: 'istanbul',
      include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
      reporter: ['json-summary', 'text'],
    },
    alias: {
      '@src': './src',
      '@test': './test',
    },
    root: './',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      '@src': './src',
      '@test': './test',
    },
  },
})
