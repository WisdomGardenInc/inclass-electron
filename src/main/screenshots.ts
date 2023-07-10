import { app, globalShortcut, clipboard, nativeImage, ipcMain, dialog } from 'electron'
import fs from 'fs-extra'
import Event, { ScreenshotsData } from '/@main/type'
import Screenshots from 'electron-screenshots-suport-touch'

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

const startScreenshot = async (screenshots: Screenshots) => {
  await screenshots.startCapture()
  screenshots.$view.webContents.executeJavaScript(`
    const mouseMove = (event) => {
      var touch = event.touches[0];
      var mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      window.dispatchEvent(mouseEvent);
    }

    const mouseUp = (event) => {
      var touch = event.changedTouches[0];
      var mouseEvent = new MouseEvent('mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      window.dispatchEvent(mouseEvent);
    }

    document.removeEventListener('touchmove', mouseMove);
    document.removeEventListener('touchend', mouseUp);
    document.addEventListener('touchmove', mouseMove);
    document.addEventListener('touchend', mouseUp);
  `)
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
        await startScreenshot(screenshots)
        // screenshots.$view.webContents.openDevTools()
        // // @ts-ignore
        // screenshots.$win.webContents.openDevTools()
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
    // @ts-ignore
    screenshots.$win.hide()
    screenshots.endCapture()
  })

  screenshots.on('cancel', (e: Event) => {
    e.preventDefault()
    // @ts-ignore
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
    // @ts-ignore
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
    // @ts-ignore
    screenshots.$win.hide()
    screenshots.endCapture()
  })

  ipcMain.handle('start-screen-shot', async () => {
    await startScreenshot(screenshots)
    // screenshots.$view.webContents.openDevTools()
    // screenshots.$win.webContents.openDevTools()
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
