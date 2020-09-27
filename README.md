# Table TDD demo

## 目录结构

```text
.
├── .browserslistrc
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── README.md                                              # 说明文档
├── babel.config.js                                        # babel配置文件
├── dist_electron                                          # electron 打包产物
├── package.json                                           # 项目依赖及信息
├── src                                                    # 主要项目文件存放目录
│   ├── main                                               # main 进程即应用程序主进程
│   │   ├── app                                            # electron app 模块
│   │   ├── ipc                                            # electron ipcMain 模块
│   │   ├── main.js                                        # electron 主进程入口文件
│   │   ├── preload                                        # electron 注入 webview 的 js 存放目录
│   │   ├── protocol                                       # electron protocol 模块
│   │   ├── utils                                          # 主进程工具类
│   │   │   └── xlsx.js                                    # excel 处理脚本
│   │   └── window                                         # electron window 模块
│   └── renderer                                           # renderer 进程即渲染进程（前端页面 view 层）
│       ├── App.vue                                        # vue 入口 sfc
│       ├── assets                                         # vue 资源文件存放目录
│       │   ├── css                                        # vue 公共 css 存放目录
│       │   │   └── reset.css                              # css 重置
│       ├── common                                         # vue 公共模块
│       │   ├── index.js                                   # vue 公共模块入口文件
│       │   ├── ipc                                        # vue ipcRenderer 模块
│       │   └── utils                                      # vue 工具类
│       ├── components                                     # vue 公共组件
│       ├── main.js                                        # vue 入口文件
│       ├── public                                         # vue 静态资源目录
│       ├── router                                         # vue router 模块
│       ├── store                                          # vue store 模块
│       └── views                                          # vue 页面
└── vue.config.js                                          # 工程配置文件
```

## 安装依赖
```
npm install # yarn install
```

### 开发模式下编译和运行
```
npm run serve
```

### 生产模式下编译和压缩
```
npm run build
```

### 整理和修复文件
```
npm run lint
```
