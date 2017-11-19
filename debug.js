const Fardown = require('./index.js')

var neatLog = require('neat-log')
var output = require('neat-log/output')

var progress = require('progress-string')
var prettierBytes = require('prettier-bytes')

var neat = neatLog(view)

var bar = progress({
  //width: 20,
  total: 100
})

function view(state) {
  return output`

    Downloading ${state.fileCount} file(s)
    Download ${prettierBytes(state.downloadSpeed)}/s - Upload ${prettierBytes(state.uploadSpeed)}/s
    ${state.percentage}% [${bar(state.percentage)}] (${prettierBytes(state.downloaded)} / ${prettierBytes(state.total)})

  `
}

const fardown = new Fardown("magnet:?xt=urn:btih:4d753474429d817b80ff9e0c441ca660ec5d2450&dn=Ubuntu+14.04+64+bit&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337")

neat.use((state, bus) => {
  state.fileCount = 0
  state.percentage = 0
  state.downloaded = 0
  state.downloadSpeed = 0
  state.uploadSpeed = 0
  state.total = 0

  setInterval(() => {
    state.fileCount = fardown.files.length || 0
    state.downloaded = fardown.isReady ? fardown.engine.swarm.downloaded : 0
    state.total = fardown.isReady ? fardown.engine.torrent.length : 0

    state.downloadSpeed = fardown.isReady ? fardown.engine.swarm.downloadSpeed() : 0
    state.uploadSpeed = fardown.isReady ? fardown.engine.swarm.uploadSpeed() : 0

    state.percentage = fardown.isReady ? ((fardown.engine.swarm.downloaded / fardown.engine.torrent.length) * 100).toPrecision(3) : 0;
    state.percentage = state.percentage <= 100 && state.percentage || 100
    bus.emit('render')
  }, 250)
  
  //bus.emit('render')
})

;(async () => {
  await fardown.ready

  neat.use((state, bus) => bus.clear())

  fardown.files.forEach((file) => {
    //console.log('Downloading ', file.path)
    file.select()
  })

  
})()