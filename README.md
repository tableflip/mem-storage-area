# mem-storage-area

[![Build Status](https://travis-ci.org/tableflip/mem-storage-area.svg?branch=master)](https://travis-ci.org/tableflip/mem-storage-area)
[![dependencies Status](https://david-dm.org/tableflip/mem-storage-area/status.svg)](https://david-dm.org/tableflip/mem-storage-area)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> A WebExtension like StorageArea in memory

For testing and whatever.

## Install

```sh
npm install mem-storage-area
```

## Usage

```js
const storage = require('mem-storage-area')

storage.onChanged.addListener((changes, areaName) => {
  console.log(`storage.${areaName} changed: ${changes}`)
})

await storage.local.set({ foo: 'bar' })

console.log(await storage.local.get('foo')) // { foo: 'bar' }

// also storage.sync and read-only storage.managed
```

### Advanced

You can access the Storage, StorageArea and Emitter objects:

```js
// If you need another storage - { local, sync, managed, onChanged }
const Storage = require('mem-storage-area/Storage')
const storage = new Storage()

// If you need an emitter
const Emitter = require('mem-storage-area/Emitter')
const onChanged = new Emitter()
// onChanged.addListener, onChanged.removeListener, onChanged.hasListener etc.
// To emit, call onChanged(arg0, arg1...)

// If you need a storage area (with optional emitter)
const StorageArea = require('mem-storage-area/StorageArea')
const area = new StorageArea({ name: 'myArea', onChanged, readOnly: false })
```
