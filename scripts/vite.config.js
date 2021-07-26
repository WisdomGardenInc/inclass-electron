const { join, resolve } = require('path')
const { external } = require('../package.json')
const { default: vue } = require('@vitejs/plugin-vue')
const { readdirSync } = require('fs')
const ViteComponents = require('vite-plugin-components').default;
const AntDesignVueResolver = require('vite-plugin-components').AntDesignVueResolver

const WindiCSS = require('vite-plugin-windicss').default


const entries = readdirSync(join(__dirname, '../src/renderer')).filter(f => f.endsWith('.html'))
  .map(f => join(__dirname, '../src/renderer', f))

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
const config = {
  root: join(__dirname, '../src/renderer'),
  base: '', // has to set to empty string so the html assets path will be relative
  build: {
    rollupOptions: {
      input: entries
    },
    outDir: resolve(__dirname, '../dist/renderer'),
    assetsInlineLimit: 0
  },
  resolve: {
    alias: {
      '/@shared': join(__dirname, '../src/shared'),
      '/@': join(__dirname, '../src/renderer')
    }
  },
  optimizeDeps: {
    exclude: external
  },
  // @ts-ignore
  plugins: [
    vue(),
    ViteComponents({
      customComponentResolvers: [
        AntDesignVueResolver(),
      ]
    })
  ]
}

module.exports = config
