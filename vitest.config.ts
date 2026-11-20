import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue() as any],
  test: {
    environment: 'jsdom', // 确保设置了 jsdom 作为测试环境
    coverage: {
      exclude: [
        '**/__test__/**',
        '**/*.test.ts',
        '**/dist/**',
        'examples/**',
        'docs/**',
        'scripts/**',
        'internal/**',
      ],
      include: [
        'packages/*/src/**/*.ts',
        'packages/*/src/**/*.vue',
        'packages/ui/*/src/**/*.ts',
        'packages/ui/*/src/**/*.vue',
        'packages/ui-kit/*/src/**/*.ts',
        'packages/ui-kit/*/src/**/*.vue',
      ],
      provider: 'v8',
      reporter: ['text-summary', 'json-summary'],
      thresholds: {
        'packages/hooks/**': { statements: 45 },
        'packages/manager/**': { statements: 75 },
        'packages/utils/**': { statements: 50 },
      },
    },
  },
});
