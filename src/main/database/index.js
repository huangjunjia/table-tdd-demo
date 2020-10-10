import { app } from 'electron'

const Nedb = require('nedb')
const path = require('path')

class Database {
  static create (name, config = {}) {
    return new Database().init(name, config)
  }

  init (name = 'cache', config = {}) {
    this.model = new Nedb(Object.assign({
      autoload: true,
      filename: path.join(app.getPath('userData'), `db/${name}.db`)
    }, config))

    // Callback is optional
    this.model.loadDatabase()

    return this.model
  }
}

export {
  Database
}
