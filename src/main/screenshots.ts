import { app, globalShortcut, clipboard, nativeImage, ipcMain } from 'electron'
import Event, { ScreenshotsData } from '/@main/type'
import Screenshots from 'electron-screenshots-suport-touch'

const uint8Array2PngBase64 = (buffer: Buffer) => {
  return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`
}

const changeTouchToMouseEvent = (screenshots: Screenshots) => {
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

export const initScreenshoots = (currentWindow: any) => {
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

  changeTouchToMouseEvent(screenshots)

  app.on('browser-window-focus', () => {
    if (!globalShortcut.isRegistered('CommandOrControl+Shift+D')) {
      globalShortcut.register('CommandOrControl+Shift+D', async () => {
        await screenshots.startCapture()
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
    // @ts-ignore
    screenshots.$win.hide()
    screenshots.endCapture()
    currentWindow.webContents.send('screen-shot-result', { screenShotBase64Url: uint8Array2PngBase64(buffer) })
  })

  screenshots.on('cancel', (e: Event) => {
    e.preventDefault()
    // @ts-ignore
    screenshots.$win.hide()
    screenshots.endCapture()
  })

  ipcMain.handle('start-screen-shot', async () => {
    await screenshots.startCapture()
    // screenshots.$view.webContents.openDevTools()
    // // @ts-ignore
    // screenshots.$win.webContents.openDevTools()
  })
}
