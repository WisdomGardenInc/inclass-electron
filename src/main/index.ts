import { app, BrowserWindow, ipcMain, Menu, session, screen, globalShortcut } from 'electron'
import './dialog'
import { Logger } from './logger'
import { initScreenshoots } from './screenshots'
import { initialize } from './services'
import indexPreload from '/@preload/index'
import indexHtmlUrl from '/@renderer/index.html'
import logoUrl from '/@static/logo.png'

Menu.setApplicationMenu(null)

let screenshots: any = null
async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  initialize(logger)
  app.whenReady().then(() => {
    createWindow()
    screenshots = initScreenshoots()
  })
}

function logout() {
  session.defaultSession.clearStorageData({ storages: ['cookies'] })
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: indexPreload,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    },
    icon: logoUrl
  })

  let currentOrg: Org | null = null

  ipcMain.handle('orgChanged', (event, arg) => {
    currentOrg = JSON.parse(arg)
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

  ipcMain.handle('create-window', (event, url) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    const newWindow = new BrowserWindow({
      height: height,
      width: width,
      x: 0,
      y: 0,
      webPreferences: {
        preload: indexPreload,
        nodeIntegration: false
      }
    })

    newWindow.webContents.on('will-redirect', async (e, url) => {
      if (currentOrg && url.includes('/user/index')) {
        mainWindow.loadURL(`${currentOrg.apiUrl}/inclass/courses`)
        newWindow.close()
        mainWindow.maximize()
        mainWindow.fullScreen = true
      }
    })
    newWindow.loadURL(url)
    screenshots.currentWindow = newWindow
  })
  mainWindow.loadURL(indexHtmlUrl)

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

app.on('browser-window-blur', () => {
  globalShortcut.unregisterAll()
})

process.nextTick(main)
