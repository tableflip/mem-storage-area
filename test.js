const test = require('ava')
const Storage = require('./Storage')

test('should get single', async (t) => {
  const storage = new Storage()

  await storage.local.set({ foo: 'bar' })
  const { foo } = await storage.local.get('foo')

  t.is(foo, 'bar')
})

test('should get multiple', async (t) => {
  const storage = new Storage()

  await storage.local.set({ foo: 'bar', baz: 'boz' })
  const { foo, baz } = await storage.local.get(['foo', 'baz'])

  t.is(foo, 'bar')
  t.is(baz, 'boz')
})

test('should get with defaults', async (t) => {
  const storage = new Storage()

  await storage.local.set({ foo: 'bar', baz: 'boz' })
  const { foo, bar, baz } = await storage.local.get({ foo: 1, bar: 2, baz: 3 })

  t.is(foo, 'bar')
  t.is(bar, 2)
  t.is(baz, 'boz')
})

test('should get all', async (t) => {
  const storage = new Storage()

  await storage.local.set({ foo: 'bar', baz: 'boz' })
  const data = await storage.local.get()

  t.deepEqual(data, { foo: 'bar', baz: 'boz' })
})

test('should not get from read-only', async (t) => {
  const storage = new Storage()
  await t.throws(storage.managed.set({ foo: 'bar' }))
  await t.throws(storage.managed.remove('foo'))
  await t.throws(storage.managed.clear())
})

test('should be able to set undefined to delete', async (t) => {
  const storage = new Storage()
  await storage.local.set({ foo: 'bar' })
  let res = await storage.local.get('foo')
  t.is(res.foo, 'bar')
  await storage.local.set({ foo: undefined })
  res = await storage.managed.get('foo')
  t.is(res.foo, undefined)
})

test('should emit on change', async (t) => {
  t.plan(4)

  const storage = new Storage()

  await storage.local.set({ foo: 1, bar: 2 })

  return new Promise(resolve => {
    const onChange = (changes, areaName) => {
      t.is(areaName, 'local')
      t.deepEqual(changes, {
        foo: { oldValue: 1, newValue: 2 },
        bar: { oldValue: 2, newValue: 3 }
      })
      storage.onChanged.removeListener(onChange)
      t.false(storage.onChanged.hasListener(onChange))
      resolve()
    }

    storage.onChanged.addListener(onChange)

    t.true(storage.onChanged.hasListener(onChange))

    storage.local.set({ foo: 2, bar: 3 })
  })
})

test('should remove single', async (t) => {
  const storage = new Storage()

  await storage.local.set({ foo: 'bar' })
  await storage.local.remove('foo')
  const { foo } = await storage.local.get('foo')

  t.is(foo, undefined)
})

test('should remove multiple', async (t) => {
  const storage = new Storage()

  await storage.local.set({ foo: 'bar', baz: 'boz' })
  await storage.local.remove(['foo', 'baz'])
  const { foo, baz } = await storage.local.get(['foo', 'baz'])

  t.is(foo, undefined)
  t.is(baz, undefined)
})

test('should clear', async (t) => {
  const storage = new Storage()

  await storage.local.set({ foo: 'bar', baz: 'boz' })
  await storage.local.clear()
  const { foo, baz } = await storage.local.get(['foo', 'baz'])

  t.is(foo, undefined)
  t.is(baz, undefined)
})
