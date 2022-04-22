import { shell, clipboard, ipcRenderer, contextBridge, Dialog, IpcRenderer } from 'electron'

/**
 * Wrapper of ipc renderer.
 *
 * So the `contextIsolation: true` won't prevent you to use method inherit from EventEmitter,
 * lile `ipcRenderer.on`
 */
const _ipcRenderer: IpcRenderer = {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener)
    return _ipcRenderer
  },
  once: (channel, listener) => {
    ipcRenderer.once(channel, listener)
    return _ipcRenderer
  },
  postMessage: (channel, message, transfers) => ipcRenderer.postMessage(channel, message, transfers),
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
    return _ipcRenderer
  },
  removeListener: (channel, listener) => {
    ipcRenderer.removeListener(channel, listener)
    return _ipcRenderer
  },
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  sendSync: (channel, ...args) => ipcRenderer.sendSync(channel, ...args),
  sendTo: (id, channel, ...args) => ipcRenderer.sendTo(id, channel, ...args),
  sendToHost: (channel, ...args) => ipcRenderer.sendToHost(channel, args),
  // event emitter methods
  setMaxListeners: (n) => {
    ipcRenderer.setMaxListeners(n)
    return _ipcRenderer
  },
  getMaxListeners: () => ipcRenderer.getMaxListeners(),
  listeners: (e) => ipcRenderer.listeners(e),
  rawListeners: (e) => ipcRenderer.rawListeners(e),
  emit: (e, ...args) => ipcRenderer.emit(e, ...args),
  listenerCount: (e) => ipcRenderer.listenerCount(e),
  addListener: (e, l) => {
    ipcRenderer.addListener(e, l)
    return _ipcRenderer
  },
  off: (e, l) => {
    ipcRenderer.off(e, l)
    return _ipcRenderer
  },

  prependListener: (e, l) => {
    ipcRenderer.prependListener(e, l)
    return _ipcRenderer
  },
  prependOnceListener: (e, l) => {
    ipcRenderer.prependOnceListener(e, l)
    return _ipcRenderer
  },
  eventNames: () => ipcRenderer.eventNames()
}

const api = {
  shell,
  clipboard,
  ipcRenderer: _ipcRenderer,
  dialog: {
    showCertificateTrustDialog(...options: any[]) {
      return ipcRenderer.invoke('dialog:showCertificateTrustDialog', ...options)
    },
    showErrorBox(...options: any[]) {
      return ipcRenderer.invoke('dialog:showErrorBox', ...options)
    },
    showMessageBox(...options: any[]) {
      return ipcRenderer.invoke('dialog:showMessageBox', ...options)
    },
    showOpenDialog(...options: any[]) {
      return ipcRenderer.invoke('dialog:showOpenDialog', ...options)
    },
    showSaveDialog(...options: any[]) {
      return ipcRenderer.invoke('dialog:showSaveDialog', ...options)
    }
  } as Pick<Dialog, 'showCertificateTrustDialog' | 'showErrorBox' | 'showMessageBox' | 'showOpenDialog' | 'showSaveDialog'>
}

try {
  contextBridge.exposeInMainWorld('electron', api)
} catch {
  (window as any).electron = api
}

window.onload = function () {
  // redefine the behavior of close button
  let confirmClose = false;
  const closeBtn = <HTMLElement>document.querySelector('.exit')
  if (closeBtn) {
    closeBtn.setAttribute('href', '#')
    closeBtn.onclick = function () {
      confirmClose = confirm('Exit(确认退出)?');
      if (confirmClose) {
        api.ipcRenderer.invoke('app:logout')
        window.close();
      }
    }
  }

  const inClassCloseBtn = <HTMLElement>document.querySelector('.icon-cl-exit')
  if (inClassCloseBtn) {
    inClassCloseBtn.onclick = function () {
      const dialogDiv = <HTMLElement>document.querySelector('.cl-dialog')
      if (dialogDiv) {
        dialogDiv.style.display = 'none'
      }
      const a = window.document.createElement('a')
      a.href = '/inclass/courses?from_class_mode_page=true'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
}
