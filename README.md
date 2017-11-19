# fardown

Tiny cli command to download torrents

## Cli Usage

```
$ fardown "magnet:?xt=urn:btih:4d753474429d817b80ff9e0c441ca660ec5d2450&dn=Ubuntu+14.04+64+bit&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337" ubuntu
```
Downloads Ubuntu 14.04 in directory `./ubuntu`

## Api Usage

#### new Fardown(magnet, directory = process.cwd())

Creates a new fardown client with magnet as torrent target

#### fardown.on('ready', fn)

Emits when torrent is ready to be downloaded

#### .isReady

Boolean, true when ready

#### .ready

Promise that resolves when client is ready. Handy for working with async programming

```js
await fardown.ready
```

#### .files

List of files

#### .downloaded

Bytes downloaded

#### .total

Total bytes in torrent

#### .downloadSpeed

Download speed in seconds

#### .uploadSpeed

Upload speed in seconds

#### .download()

Downloads all the files