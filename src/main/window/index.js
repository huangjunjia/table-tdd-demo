import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { BrowserWindow } from 'electron'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

/**
 * app window实例
 * */
class Window {
  constructor (config) {
    this.config = config
    this.window = null
  }

  // 静态方法
  static create (config) {
    return new Window(config).start()
  }

  start () {
    this.window = new BrowserWindow(this.config)
    this.window.maximize()
    this.window.show()

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      this.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
      if (!process.env.IS_TEST) this.window.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      this.window.loadURL('app://./index.html')
    }

    this.window.on('closed', () => {
      this.window = null
    })

    return this.window
  }
}

// 导出Window实例
export {
  Window
}
