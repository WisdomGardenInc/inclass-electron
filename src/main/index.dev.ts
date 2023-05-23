import { app, BrowserWindow } from 'electron'
import { Socket } from 'net'
// @ts-ignore
import extensions from 'vue-devtools'
// eslint-disable-next-line import/first
import './index'

app.on('browser-window-created', (event, window) => {
  // window.webContents.openDevTools() // 是否开启控制台
})

const devServer = new Socket({}).connect(3031, '127.0.0.1')
devServer.on('data', () => {
  BrowserWindow.getAllWindows().forEach(w => w.reload())
})
