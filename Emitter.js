module.exports = function Emitter () {
  let listeners = []

  function emitter () {
    listeners.forEach(l => l.apply(null, arguments))
  }

  emitter.addListener = (cb) => {
    listeners = listeners.concat(cb)
    return emitter
  }

  emitter.removeListener = (cb) => {
    listeners = listeners.filter((l) => l !== cb)
    return emitter
  }

  emitter.hasListener = (cb) => listeners.indexOf(cb) > -1

  return emitter
}
