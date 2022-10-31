import { app, BrowserWindow, ipcMain, Menu, session, netLog } from 'electron'
import log from 'electron-log'
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
  app.whenReady().then(async () => {
    await netLog.startLogging('C:\inclass.log')
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
      contextIsolation: false,
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

  const url = require('url').format({
    protocol: 'http',
    hostname: 'lms.sgxx.cn',
    pathname: '/public-course'
  })

  mainWindow.loadURL(url).then(() => {
    log.info('load success')
  }, (err) => {
    log.error('load error')
    log.error(err)
  })

  mainWindow.webContents.on('did-get-redirect-request', function (e, oldURL, newURL, isMainFrame, httpResponseCode, requestMethod, refeerrer, header) {
    log.info('I am did-get-redirect-request')

    if (isMainFrame) {
      setTimeout(() => mainWindow.loadURL(newURL), 100);
      e.preventDefault();
    }
  });

  netLog.stopLogging()
  mainWindow.webContents.on('will-redirect', function (e, newURL, isInPlace, isMainFrame) {
    log.info('I am will-redirect out')
    if (isMainFrame) {
      setTimeout(() => mainWindow.loadURL(newURL), 100)
      e.preventDefault()
    }
  })

  mainWindow.webContents.on('did-create-window', (childWindow) => {
    log.info('I am did-create-window')

    mainWindow.webContents.on('will-redirect', function (e, newURL, isInPlace, isMainFrame) {
      log.info('I am will-redirect inner')
      if (isMainFrame) {
        setTimeout(() => mainWindow.loadURL(newURL), 100)
        e.preventDefault()
      }
    })
  })
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
  // })

  mainWindow.show()

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
