import { app, BrowserWindow, ipcMain, Menu, session } from 'electron'
import './dialog'
import { Logger } from './logger'
import { initScreenshoots } from './screenshots'

import { initialize } from './services'
import indexPreload from '/@preload/index'
import logoUrl from '/@static/cdut-logo.png'

app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('ignore-gpu-blocklist')

Menu.setApplicationMenu(null)
let screenshots: any = null
async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  initialize(logger)
  app.whenReady().then(() => {
    screenshots = initScreenshoots()
    createWindow()
  })
}

function logout() {
  session.defaultSession.clearStorageData({ storages: ['cookies'] })
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1300,
    webPreferences: {
      preload: indexPreload,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    },
    icon: logoUrl,
    title: '学在海指'
  })

  ipcMain.handle('open-inclass-list', (event, arg) => {
    mainWindow.loadURL(arg.next_url)
    mainWindow.maximize()
    mainWindow.fullScreen = true
    mainWindow.webContents.on('did-finish-load', function () {
    })
  })

  ipcMain.handle('closeApp', (event, arg) => {
    mainWindow.close()
  })

  ipcMain.handle('app:logout', () => {
    logout()
  })

  const apiUrl = 'http://lms.hjzh.mtn'

  mainWindow.webContents.on('will-redirect', async (e, url) => {
    if (url.includes('/user/index')) {
      mainWindow.loadURL(`${apiUrl}/inclass/courses`)
      mainWindow.maximize()
      mainWindow.fullScreen = true
    }
  })

  mainWindow.loadURL(`${apiUrl}/inclass/courses`)
  screenshots.currentWindow = mainWindow

  mainWindow.on('page-title-updated', (evt) => {
    evt.preventDefault()
  })

  return mainWindow
}

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('window-all-closed', () => {
  logout()
  app.quit()
})

process.nextTick(main)
