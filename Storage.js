const Emitter = require('./Emitter')
const StorageArea = require('./StorageArea')

function Storage () {
  const onChanged = new Emitter()

  return {
    local: new StorageArea({ name: 'local', onChanged }),
    sync: new StorageArea({ name: 'sync', onChanged }),
    managed: new StorageArea({ name: 'managed', readOnly: true }),
    onChanged
  }
}

module.exports = Storage
