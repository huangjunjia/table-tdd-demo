import { ipcMain } from 'electron'
import File from '../database/dao/file.dao'

const path = require('path')
const { readFileSync } = require('fs')
const { Xlsx } = require('../utils/xlsx')

const receiveFile = (file) => {
  return new Promise((resolve, reject) => {
    File.findOne({
      name: file.name,
      path: file.path,
      type: file.type
    })
      .then(data => !data && File.insert(file))
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        let fileUtil
        let result = null
        switch (file.type) {
          case 'xls':
          case 'xlsx':
            fileUtil = new Xlsx(file.path)
            result = {
              sheetNames: fileUtil.getSheetName(),
              sheets: fileUtil.getSheet(),
              headers: fileUtil.getHeaderEow()
            }
            break
          case 'json':
            result = JSON.parse(readFileSync(path.resolve(file.path), 'utf-8'))
            break
        }
        resolve(result)
      })
  })
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
      receiveFile(arg).then(res => {
        event.reply(`reply-receive-file-result:${arg.id}`, {
          id: arg.id,
          name: arg.name,
          data: res
        })
      })
    })
  }

  saveFileMsg () {

  }
}

export {
  Ipc
}
