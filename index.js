const { EventEmitter } = require('events');
const torrentStream = require('torrent-stream')

const assert = require('assert')

module.exports = class Fardown extends EventEmitter {
  constructor(source, path = process.cwd()) {
    super();

    assert(source, 'Need a source')
    this.source = source

    this.isReady = false
    this.ready = new Promise(resolve => {
      if (this.isReady) {
        resolve()
      } else {
        this.on('ready', resolve)
      }
    })

    this.engine = torrentStream(this.source, { path })

    this.engine.on('ready', this._onEngineReady.bind(this))
  }

  get files() { return this.engine.files }

  get downloaded() { return this.isReady ? this.engine.swarm.downloaded : 0 }

  get total() { return this.isReady ? this.engine.torrent.length : 0 }

  get downloadSpeed() { return this.isReady ? this.engine.swarm.downloadSpeed() : 0 }
  get uploadSpeed() { return this.isReady ? this.engine.swarm.uploadSpeed() : 0 }

  _onEngineReady() {
    this.isReady = true
    this.emit('ready')
  }

  download() {
    assert(this.isReady, 'engine is not ready yet')

    this.engine.files.forEach((file) => file.select())
  }
}