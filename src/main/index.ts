import { app, BrowserWindow, BrowserView, ipcMain, Menu, session } from 'electron'
import './dialog'
import { Logger } from './logger'
import { initialize } from './services'
import indexPreload from '/@preload/index'
import anotherPreload from '/@preload/another'
import indexHtmlUrl from '/@renderer/index.html'
import sideHtmlUrl from '/@renderer/side.html'
import logoUrl from '/@static/logo.png'

Menu.setApplicationMenu(null)
async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  initialize(logger)
  app.whenReady().then(() => {
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

  mainWindow.webContents.openDevTools()

  const view = new BrowserView()
  mainWindow.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 800, height: 1300 })
  view.webContents.loadURL('http://lms.sgxx.cn/inclass/courses')

  // mainWindow.loadURL('http://lms.sgxx.cn/inclass/courses')

  // mainWindow.webContents.on('will-redirect', function (e, newURL, isInPlace, isMainFrame) {
  //   if (isMainFrame) {
  //     setTimeout(() => mainWindow.loadURL(newURL), 100)
  //     e.preventDefault()
  //   }
  // })

  mainWindow.webContents.on('did-create-window', (childWindow) => {
    // mainWindow.webContents.on('will-redirect', function (e, newURL, isMainFrame) {
    //   console.log(newURL, isMainFrame)
    //   if (isMainFrame) {
    //     setTimeout(() => mainWindow.loadURL(newURL), 100)
    //     e.preventDefault()
    //   }
    // })
    // childWindow.webContents.on('will-redirect', async (e, url) => {
    //   if (currentOrg && url.includes('/user/index')) {
    //     mainWindow.loadURL(`${currentOrg.apiUrl}/inclass/courses`)
    //     childWindow.close()
    //     mainWindow.maximize()
    //     mainWindow.fullScreen = true
    //   }
    // })
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
