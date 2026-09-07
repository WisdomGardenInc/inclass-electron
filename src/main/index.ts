import { app, BrowserWindow, ipcMain, Menu, session, screen, globalShortcut } from 'electron'
import { URL } from 'url'
import './dialog'
import { Logger } from './logger'
import { initScreenshoots } from './screenshots'
import { initialize } from './services'
import indexPreload from '/@preload/index'
import logoUrl from '/@static/logo.png'

Menu.setApplicationMenu(null)

// 厦门大学定制包：启动即进统一身份认证，不再经过应用内的机构选择/登录页。
// 对应 src/shared/orgs.json 里 deliveryOrg === 'XMU' 的 apiUrl。
const apiUrl = 'https://lnt.xmu.edu.cn'
const coursesUrl = `${apiUrl}/inclass/courses`

/** 判断 url 是否为本校 LMS 下的指定路径，避免误命中 CAS 回跳参数里的同名路径 */
function isLmsPath(rawUrl: string, pathPrefix: string) {
  try {
    const url = new URL(rawUrl)
    return url.origin === new URL(apiUrl).origin && url.pathname.startsWith(pathPrefix)
  } catch {
    return false
  }
}

let screenshots: any = null
async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  initialize(logger)
  app.whenReady().then(() => {
    // 必须先初始化截图模块：createWindow() 末尾要把主窗口注册给它
    screenshots = initScreenshoots()
    const mainWindow = createWindow()

    mainWindow.on('closed', () => {
      app.quit()
    })
  })
}

function logout() {
  session.defaultSession.clearStorageData({ storages: ['cookies'] })
}

function enterCourseList(mainWindow: BrowserWindow) {
  mainWindow.maximize()
  mainWindow.fullScreen = true
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const mainWindow = new BrowserWindow({
    height,
    width,
    x: 0,
    y: 0,
    webPreferences: {
      preload: indexPreload,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    },
    icon: logoUrl
  })

  // 渲染层的机构选择页在本分支已不加载，保留 handler 只为兼容其 invoke 调用
  ipcMain.handle('orgChanged', () => {})

  ipcMain.handle('open-inclass-list', (event, arg) => {
    mainWindow.loadURL(arg.next_url)
    enterCourseList(mainWindow)
  })

  ipcMain.handle('closeApp', (event, arg) => {
    mainWindow.close()
  })

  ipcMain.handle('app:logout', () => {
    logout()
  })

  // 统一身份认证一律在主窗口内完成，不再另开窗口
  ipcMain.handle('create-window', (event, url) => {
    mainWindow.loadURL(url)
  })

  // CAS 回调后若被 LMS 甩到个人首页，纠正到课程列表
  mainWindow.webContents.on('will-redirect', (e, url) => {
    if (isLmsPath(url, '/user/index')) {
      mainWindow.loadURL(coursesUrl)
    }
  })

  // 登录完成、真正落到课程列表时才全屏
  mainWindow.webContents.on('did-navigate', (e, url) => {
    if (isLmsPath(url, '/inclass/courses')) {
      enterCourseList(mainWindow)
    }
  })

  mainWindow.loadURL(coursesUrl)
  screenshots.currentWindow = mainWindow

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
