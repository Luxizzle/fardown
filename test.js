import test from 'ava'

const Fardown = require('./index.js')

const fardown = new Fardown('magnet:?xt=urn:btih:4d753474429d817b80ff9e0c441ca660ec5d2450&dn=Ubuntu+14.04+64+bit&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337')

test('Should construct an Fardown api client', async t => {
  t.truthy(Fardown)
  t.truthy(fardown)
  t.true(fardown instanceof Fardown, 'Did not return a client')  
})

test('Should emit ready and set isReady to true', async t => {
  setTimeout(() => {
    t.fail('Took too long to ready')
  }, 10000) // 10 seconds should be enough right?

  await new Promise((resolve, reject) => {
    fardown.on('ready', () => {
      resolve()
    })
  })

  t.true(fardown.isReady)
})

test('ready should be a promised resolving when ready', async t => {
  setTimeout(() => {
    t.fail('Took too long to ready')
  }, 10000) // 10 seconds should be enough right?

  await fardown.ready

  t.true(fardown.isReady)
})

test('files should be an array', async t => {
  await fardown.ready
  
  t.deepEqual(fardown.files, fardown.engine.files, 'Should be equal to engine files since its a getter')
})