import { app, globalShortcut, clipboard, nativeImage, ipcMain } from 'electron'
import Event, { ScreenshotsData } from './types'
import Screenshots from 'electron-screenshots-suport-touch'

const uint8Array2PngBase64 = (buffer: Buffer) => {
  return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`
}

const changeTouchToMouseEvent = (screenshots: Screenshots) => {
  if (!screenshots.$view?.webContents) return
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
    `).catch(() => { /* $view 可能未就绪，忽略 */ })
}

export const initScreenshoots = () => {
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

  const safeStartCapture = async () => {
    try {
      await screenshots.startCapture()
      // $view 在第一次 startCapture 时才会创建，这里注入才安全
      changeTouchToMouseEvent(screenshots)
    } catch (err) {
      console.error('[screenshots] startCapture failed:', err)
      try { screenshots.endCapture() } catch (_) { /* ignore */ }
    }
  }

  app.on('browser-window-focus', () => {
    if (!globalShortcut.isRegistered('CommandOrControl+Shift+D')) {
      globalShortcut.register('CommandOrControl+Shift+D', safeStartCapture)
    }
  })

  // 截屏窗口内监听 ESC，避免全局拦截 Esc 引发的冲突 / 原生崩溃
  screenshots.on('windowCreated' as any, () => {
    const view = (screenshots as any).$view
    if (!view?.webContents) return
    view.webContents.on('before-input-event', (_e: any, input: any) => {
      if (input.type === 'keyDown' && input.key === 'Escape') {
        try {
          (screenshots as any).$win?.hide()
          screenshots.endCapture()
        } catch (_) { /* ignore */ }
      }
    })
  })

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })

  screenshots.on('ok', (e: Event, buffer: Buffer, bounds: ScreenshotsData) => {
    e.preventDefault()
    try {
      // @ts-ignore
      screenshots.$win?.hide()
      screenshots.endCapture()
    } catch (_) { /* ignore */ }

    if (!buffer || buffer.length === 0) {
      console.warn('[screenshots] empty buffer, skip')
      return
    }

    try {
      const img = nativeImage.createFromBuffer(buffer)
      if (!img.isEmpty()) {
        clipboard.writeImage(img)
      }
      // @ts-ignore
      screenshots.currentWindow?.webContents?.send('screen-shot-result', {
        screenShotBase64Url: uint8Array2PngBase64(buffer)
      })
    } catch (err) {
      console.error('[screenshots] handle ok failed:', err)
    }
  })

  screenshots.on('cancel', (e: Event) => {
    e.preventDefault()
    try {
      // @ts-ignore
      screenshots.$win?.hide()
      screenshots.endCapture()
    } catch (_) { /* ignore */ }
  })

  ipcMain.handle('start-screen-shot', safeStartCapture)

  return screenshots
}
