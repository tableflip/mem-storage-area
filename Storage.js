const Emitter = require('./Emitter')
const StorageArea = require('./StorageArea')

function Storage () {
  const onChange = new Emitter()

  return {
    local: new StorageArea({ name: 'local', onChange }),
    sync: new StorageArea({ name: 'sync', onChange }),
    managed: new StorageArea({ name: 'managed', readOnly: true }),
    onChange
  }
}

module.exports = Storage
