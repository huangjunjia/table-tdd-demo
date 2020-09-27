import { ipcMain } from 'electron'

const { resolve } = require('path')
const { readFileSync } = require('fs')
const { Xlsx } = require('../utils/xlsx')

const receiveFile = (file) => {
  let fileUtil
  let result = null
  switch (file.type) {
    case 'xls':
    case 'xlsx':
      fileUtil = new Xlsx(file.path)
      result = {
        sheetNames: fileUtil.getSheetName(),
        sheets: fileUtil.getSheet(fileUtil.getSheetName())
        // headers: fileUtil.getHeaderEow()
      }
      break
    case 'json':
      result = JSON.parse(readFileSync(resolve(file.path), 'utf-8'))
      break
  }
  return result
}

class Ipc {
  static create () {
    return new Ipc().start()
  }

  start () {
    this.receiveFile()
  }

  // 接收文件并解析之后将结果返回
  receiveFile () {
    ipcMain.on('receive-file', (event, arg) => {
      event.reply(`reply-receive-file-result:${arg.id}`, {
        id: arg.id,
        name: arg.name,
        data: receiveFile(arg)
      })
    })
  }
}

export {
  Ipc
}
