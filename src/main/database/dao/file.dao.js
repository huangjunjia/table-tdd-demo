import { DatabaseFactory } from '../factories'
import { Database } from '../index'

const model = Database.create('file')

class FileDB extends DatabaseFactory {
  constructor () {
    super(model)
  }

  /**
   * 清除所有数据
   */
  removeAll () {
    return new Promise((resolve, reject) => {
      this.model.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {
          reject(err)
        } else {
          resolve(numRemoved)
        }
      })
    })
  }
}

export default new FileDB()
