const { join, resolve } = require('path')
const { external } = require('../package.json')
const { default: vue } = require('@vitejs/plugin-vue')
const { readdirSync } = require('fs')
const Components = require("unplugin-vue-components/vite")
const Resolver = require('unplugin-vue-components/resolvers')
const Unocss = require('unocss/vite').default;
const presetWind = require('@unocss/preset-wind').default;

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
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: { 'primary-color': '#00BBBD' },
        javascriptEnabled: true,
      },
    },
  },
  // @ts-ignore
  plugins: [
    vue(),
    Components({
      resolvers: [
        Resolver.AntDesignVueResolver({ importStyle: "less" }),
      ]
    }),
    Unocss({
      presets: [
        presetWind()
      ]
    })
  ]
}

module.exports = config
