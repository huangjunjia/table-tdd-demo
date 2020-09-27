import { utils } from '@/common'

class Ipc {
  static create () {
    return new Ipc()
  }

  constructor () {
    this.ipcRenderer = window.ipcRenderer
  }

  receiveFile (file) {
    return new Promise(resolve => {
      const uuid = utils.uuid(8, 16)
      this.ipcRenderer.send('receive-file', {
        id: uuid,
        name: file.name,
        path: file.path,
        type: file.name.replace(/\S+\.([a-zA-Z0-9]+$)/, '$1')
      })
      this.ipcRenderer.once(`reply-receive-file-result:${uuid}`, (event, arg) => resolve(arg))
    })
  }
}

export {
  Ipc
}
