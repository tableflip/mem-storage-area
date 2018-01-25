module.exports = function Emitter () {
  let listeners = []

  function emitter () {
    listeners.forEach(l => l.apply(null, arguments))
  }

  emitter.addListener = (listener) => {
    listeners = listeners.concat(listener)
    return emitter
  }

  emitter.removeListener = (listener) => {
    listeners = listeners.filter((l) => l !== listener)
    return emitter
  }

  emitter.hasListener = (listener) => listeners.indexOf(listener) > -1

  return emitter
}
