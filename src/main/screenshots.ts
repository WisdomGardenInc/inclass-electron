import { app, globalShortcut, clipboard, nativeImage, ipcMain, dialog } from 'electron'
import fs from 'fs-extra'
import Event, { ScreenshotsData } from '/@main/type'
const Screenshots = require('electron-screenshots').default

let intervalId: NodeJS.Timeout | null = null

const uint8Array2PngBase64 = (buffer: Buffer) => {
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`
}

const padStart = (string: unknown, length = 0, chars = ' '): string => {
  let str = String(string)
  while (str.length < length) {
    str = `${chars}${str}`
  }
  return str
}

export const initScreenshoots = () => {
  let screenShotBase64Url: string = ''
  let screenShotBoundsInfo: Object = {}
  const screenshots = new Screenshots(
    {
      singleWindow: true,
      lang: {
        magnifier_position_label: 'Position',
        operation_ok_title: '',
        operation_cancel_title: '',
        operation_save_title: '',
        operation_redo_title: '',
        operation_undo_title: '',
        operation_mosaic_title: '',
        operation_text_title: '',
        operation_brush_title: '',
        operation_arrow_title: '',
        operation_ellipse_title: '',
        operation_rectangle_title: ''
      }
    }
  )

  app.on('browser-window-focus', () => {
    if (!globalShortcut.isRegistered('CommandOrControl+Shift+D')) {
      globalShortcut.register('CommandOrControl+Shift+D', async () => {
        await screenshots.startCapture()
      })
    }

    if (!globalShortcut.isRegistered('esc')) {
      globalShortcut.register('esc', () => {
        if (screenshots.$win?.isFocused()) {
          screenshots.$win.hide()
          screenshots.endCapture()
        }
      })
    }
  })

  screenshots.on('ok', (e: Event, buffer: Buffer, bounds: ScreenshotsData) => {
    clipboard.writeImage(nativeImage.createFromBuffer(buffer))
    e.preventDefault()
    screenShotBase64Url = uint8Array2PngBase64(buffer)
    screenShotBoundsInfo = bounds
    screenshots.$win.hide()
    screenshots.endCapture()
  })

  screenshots.on('cancel', (e: Event) => {
    e.preventDefault()
    screenshots.$win.hide()
    screenshots.endCapture()
  })

  screenshots.on('save', async (e: Event, buffer: Buffer) => {
    e.preventDefault()
    const time = new Date()
    const year = time.getFullYear()
    const month = padStart(time.getMonth() + 1, 2, '0')
    const date = padStart(time.getDate(), 2, '0')
    const hours = padStart(time.getHours(), 2, '0')
    const minutes = padStart(time.getMinutes(), 2, '0')
    const seconds = padStart(time.getSeconds(), 2, '0')
    const milliseconds = padStart(time.getMilliseconds(), 3, '0')
    const { canceled, filePath } = await dialog.showSaveDialog(screenshots.$win, {
      defaultPath: `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}.png`,
      filters: [
        { name: 'Image (png)', extensions: ['png'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    if (!canceled) {
      // @ts-ignore
      await fs.writeFile(filePath, buffer)
    }
    screenshots.$win.hide()
    screenshots.endCapture()
  })

  ipcMain.handle('start-screen-shot', async () => {
    // screenshots.$view.webContents.openDevTools()
    // screenshots.$win.webContents.openDevTools()
    await screenshots.startCapture()
  })

  intervalId = setInterval(() => {
    if (screenShotBase64Url !== '') {
      ipcMain.handle('send-screen-shot-result', async () => {
        const oldScreenShotBase64Url = screenShotBase64Url
        screenShotBase64Url = ''
        return { screenShotBase64Url: oldScreenShotBase64Url, screenShotBoundsInfo: screenShotBoundsInfo }
      })
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, 500)
}
