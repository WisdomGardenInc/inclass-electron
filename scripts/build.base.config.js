
/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  productName: '中国人民公安大学',
  // exe 文件名 / 进程名使用 ASCII，避免 Electron 在 Windows 上对含中文路径的原生模块解析异常（截屏崩溃等）
  executableName: 'ppsuc-class',
  appId: 'cn.ppsuc.inclass',
  electronVersion: process.env.ELECTRON_VERSION, // only used for development debugging
  directories: {
    output: 'build',
    buildResources: 'build',
    app: 'dist'
  },
  // assign publish for auto-updater
  // set this to your own repo!
  // publish: [{
  //   provider: 'github',
  //   owner: '',
  //   repo: ''
  // }],
  files: [
    // don't include node_modules as all js modules are bundled into production js by rollup
    // unless you want to prevent some module to bundle up
    // list them below
  ]
}

module.exports = config
