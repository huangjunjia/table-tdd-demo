const path = require('path')
const resolve = p => path.resolve(__dirname, p)

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  pages: {
    index: {
      // page 的入口
      entry: resolve('./src/renderer/main.js'),
      // 模板来源
      template: resolve('./src/renderer/public/index.html'),
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  chainWebpack: config => {
    config
      .entry('index')
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
      mainProcessWatch: [],
      // Provide a list of arguments that Electron will be launched with during "electron:serve",
      // which can be accessed from the main process (src/background.js).
      // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
      // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
      mainProcessArgs: []
    }
  }
}
