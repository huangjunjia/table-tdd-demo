// Scheme must be registered before the app is ready
import { protocol } from 'electron'

class Protocol {
  static create () {
    return new Protocol().start()
  }

  start () {
    protocol.registerSchemesAsPrivileged([
      { scheme: 'app', privileges: { secure: true, standard: true } }
    ])
  }
}

export {
  Protocol
}
