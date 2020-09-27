'use strict'
import { Window } from './window'
import { App } from '@/main/app'
import { Protocol } from '@/main/protocol'
import { Ipc } from '@/main/ipc'

const path = require('path')

const win = new Window({
  width: 800,
  minWidth: 800,
  height: 600,
  minHeight: 600,
  webPreferences: {
    // Use pluginOptions.nodeIntegration, leave this alone
    // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    preload: path.join(__dirname, 'preload.js')
  }
})

App.create(win)
Protocol.create()
Ipc.create()
