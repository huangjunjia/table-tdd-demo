const path = require('path')
const resolve = p => path.resolve(__dirname, p)

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  chainWebpack: config => {
    config
      .entry('app')
      .clear()
      .add(resolve('./src/renderer/main.js'))
      .end()
    config.resolve.alias
      .set('@', resolve('./src/renderer'))
      .end()
  },
  pluginOptions: {
    electronBuilder: {
      // Preload files allow you to execute JS with Node integration in the context of your Vue App (shared window variable)
      preload: resolve('./src/main/preload/index.js'),
      chainWebpackMainProcess: (config) => {
        // Chain webpack config for electron main process only
      },
      chainWebpackRendererProcess: (config) => {
        // Chain webpack config for electron renderer process only
        // The following example will set IS_ELECTRON to true in your app
      },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: resolve('./src/main/main.js'),
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      mainProcessWatch: [
        resolve('./src/main')
      ],
      // Provide a list of arguments that Electron will be launched with during "electron:serve",
      // which can be accessed from the main process (src/background.js).
      // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
      // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
      mainProcessArgs: []
    }
  }
}
