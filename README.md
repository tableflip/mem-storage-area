# mem-storage-area

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
