class StorageArea {
  constructor (options) {
    this._options = options || {}
    this._store = {}
  }

  _get (arg) {
    if (arg == null) {
      return Object.keys(this._store).reduce((res, k) => {
        res[k] = JSON.parse(this._store[k])
        return res
      }, {})
    }

    if (isString(arg)) {
      const res = {}
      if (this._store[arg] !== undefined) {
        res[arg] = JSON.parse(this._store[arg])
      }
      return res
    }

    if (Array.isArray(arg)) {
      return arg
        .filter(isString)
        .reduce((res, key) => Object.assign(res, this._get(key)), {})
    }

    return Object.assign({}, arg, this._get(Object.keys(arg)))
  }

  get (arg) {
    return new Promise(resolve => resolve(this._get(arg)))
  }

  _set (obj) {
    Object.keys(obj).forEach((k) => {
      if (obj[k] !== undefined) {
        this._store[k] = JSON.stringify(obj[k])
      } else {
        delete this._store[k]
      }
    })
  }

  set (obj) {
    if (this._options.readOnly) {
      return Promise.reject(new Error('This storage area is read-only'))
    }

    return new Promise(resolve => {
      const oldStore = Object.assign({}, this._store)
      this._set(obj)
      resolve(oldStore)
    })
    .then((oldStore) => {
      if (!this._options.onChange) return

      const changes = Object.keys(obj).reduce((changes, key) => {
        changes[key] = {
          oldValue: oldStore[key] && JSON.parse(oldStore[key]),
          newValue: obj[key]
        }
        return changes
      }, {})

      this._options.onChange(changes, this._options.name)
    })
  }

  _remove (arg) {
    if (Object.prototype.toString.call(arg) === '[object String]') {
      delete this._store[arg]
      return
    }

    arg.forEach((key) => this._remove(key))
  }

  remove (arg) {
    if (this._options.readOnly) {
      return Promise.reject(new Error('This storage area is read-only'))
    }

    return new Promise(resolve => {
      const oldStore = Object.assign({}, this._store)
      this._remove(arg)
      resolve(oldStore)
    })
    .then((oldStore) => {
      if (!this._options.onChange) return

      const changes = (Array.isArray(arg) ? arg : [arg]).reduce((changes, key) => {
        changes[key] = {
          oldValue: oldStore[key] && JSON.parse(oldStore[key]),
          newValue: undefined
        }
        return changes
      }, {})

      this._options.onChange(changes, this._options.name)
    })
  }

  clear () {
    if (this._options.readOnly) {
      return Promise.reject(new Error('This storage area is read-only'))
    }

    return new Promise(resolve => {
      const oldStore = this._store
      this._store = {}
      resolve(oldStore)
    })
    .then((oldStore) => {
      if (!this._options.onChange) return

      const changes = Object.keys(oldStore).reduce((changes, key) => {
        changes[key] = { oldValue: JSON.parse(oldStore[key]), newValue: undefined }
        return changes
      }, {})

      this._options.onChange(changes, this._options.name)
    })
  }

  getBytesInUse () {
    return Promise.reject(new Error('Not implemented'))
  }
}

module.exports = StorageArea

const isString = (arg) => Object.prototype.toString.call(arg) === '[object String]'
