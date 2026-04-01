import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Include default patterns AND your custom pattern
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/*.int.test.ts'],
  },
})
