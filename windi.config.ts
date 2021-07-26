import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class', // or 'media'
  extract: {
    // accepts globs and file paths relative to project root
    include: [
      'src/renderer/**/*.{vue,html,jsx,tsx}',
      '../src/renderer/**/*.vue',
    ],
    exclude: [
      'node_modules/**/*',
      '.git/**/*',
    ],
  },
})
