#!/usr/bin/env node

const neatLog = require('neat-log')
const output = require('neat-log/output')
const progress = require('progress-string')
const prettierBytes = require('prettier-bytes')

process.on('unhandledRejection', err => {
  if (!(err instanceof Error)) {
    err = new Error(`Promise rejected with value: ${util.inspect(err)}`);
  }

  console.error(err.stack);
  process.exit(1); // eslint-disable-line unicorn/no-process-exit
});

const Fardown = require('./index')

const bar = progress({
  total: 100
})

const neat = neatLog(view)

function view(state) {
  return output`
  
    Downloading ${state.fileCount} ${state.fileCount === 1 ? 'file' : 'files'}
    ${state.files}

    Speed: Down ${prettierBytes(state.downloadSpeed)}/s - Up ${prettierBytes(state.uploadSpeed)}/s
    ${state.percentage}% [${bar(state.percentage)}] (${prettierBytes(state.downloaded)} / ${prettierBytes(state.total)})

  `
}

const args = process.argv.slice(2)
const magnet = args[0]
const path = args[1] || process.cwd()

if (!magnet) {
  console.log('\n\tNeed a magnet\n')
  process.exit()
}

const client = new Fardown(magnet, path)

neat.use(async (state, bus) => {
  state.fileCount = 0,
  state.files = '',
  state.downloadSpeed = 0,
  state.uploadSpeed = 0,
  state.percentage = 0,
  state.downloaded = 0,
  state.total = 0

  bus.emit('render')

  await client.ready

  setInterval(() => {
    state.fileCount = client.files.length
    state.files = client.files.map((file) => file.name).join('\n')
    state.downloadSpeed = client.downloadSpeed
    state.uploadSpeed = client.uploadSpeed
    state.percentage = ((client.downloaded / client.total) * 100).toPrecision(3)
    state.downloaded = client.downloaded
    state.total = client.total

    bus.emit('render')
  }, 250)

})

client.on('ready', () => {
  client.download()
})