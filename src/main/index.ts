import { app, BrowserWindow, ipcMain } from 'electron'
import './dialog'
import { Logger } from './logger'
import { initialize } from './services'
import indexPreload from '/@preload/index'
import anotherPreload from '/@preload/another'
import indexHtmlUrl from '/@renderer/index.html'
import sideHtmlUrl from '/@renderer/side.html'
import logoUrl from '/@static/logo.png'

async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  initialize(logger)
  app.whenReady().then(() => {
    const main = createWindow()
    // const [x, y] = main.getPosition()
    // const side = createSecondWindow()
    // side.setPosition(x + 800 + 5, y)
  })
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: indexPreload,
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: logoUrl
  })


  let currentOrg: Org | null = null;


  ipcMain.handle("orgChanged", (event, arg) => {
    currentOrg = JSON.parse(arg)
  })

  mainWindow.loadURL(indexHtmlUrl)

  // session.defaultSession.webRequest.onHeadersReceived({urls: ['*://lms-qa.tronclass.com.cn/*']}, (details, callback) => {
  //   console.log("###onHeadersReceived:", details.responseHeaders)
  //   callback(details)
  // })

  mainWindow.webContents.on('did-create-window', (childWindow) => {
    childWindow.webContents.on('will-redirect', async (e, url) => {
      if (currentOrg && url.includes("/user/index")) {
        mainWindow.loadURL(`${currentOrg.apiUrl}/inclass/courses`);
        childWindow.close();
        mainWindow.maximize()
      }
    })
  })
  return mainWindow
}

function createSecondWindow() {
  const sideWindow = new BrowserWindow({
    height: 600,
    width: 300,
    webPreferences: {
      preload: anotherPreload,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  sideWindow.loadURL(sideHtmlUrl)
  return sideWindow
}

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.nextTick(main)
