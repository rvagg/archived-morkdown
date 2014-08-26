#!/usr/bin/env node

var me     = require('..')
  , spawn  = require('child_process').spawn
  , os     = require('os')
  , fs     = require('fs')
  , path   = require('path')
  , argv = (function () {
      var argv = require('optimist').argv
        , def, p
      try {
        def = JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.morkdownrc')))
        for (p in argv)
          def[p] = argv[p]
        argv = def
      } catch (e) {}
      return argv
    }())
  , watching = argv.w
  , file   = watching ? argv.w : argv._[0]
  , port   = argv.port || 2000 + Math.round(Math.random() * 5000)
  , theme  = argv.theme

  , bin    = 'google-chrome'
  , darwinBin = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      , '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
      , '/opt/homebrew-cask/Caskroom/google-chrome/stable-channel/Google Chrome.app/Contents/MacOS/Google Chrome'
      , '/opt/homebrew-cask/Caskroom/google-chrome/latest/Google Chrome.app/Contents/MacOS/Google Chrome'
    ]
  , linuxBin = [
        '/usr/bin/google-chrome'
      , '/usr/bin/chromium-browser'
    ]
  , args   = [
        '--app=http://localhost:' + port
      , '--disk-cache-size 0'
      , '--no-proxy-server'
    ]

if (file && fs.existsSync(file) && !fs.statSync(file).isFile()) {
  console.error('File [' + file + '] is not a regular file')
  file = null
}

if (file && !fs.existsSync(file))
  fs.writeFileSync(file, '', 'utf8')

if (!file) {
  console.error('Usage: morkdown <path to file.md>')
  process.exit(-1)
}

if (os.platform() == 'darwin') {
  bin = darwinBin.reduce(function (p, c) {
    if (p)
      return p
    return fs.existsSync(c) && c
  }, null)

  if (!bin)
    throw(new Error('Chrome or Canary were not found'))
}

if (os.platform() == 'linux') {
  bin = linuxBin.reduce(function (p, c) {
    if (p)
      return p
    return fs.existsSync(c) && c
  }, null)

  if (!bin)
    throw(new Error('Chrome or Chromium were not found'))
}

me(file, theme, watching).listen(port)

if (process.env.HOME)
  args.push('--user-data-dir=' + path.join(process.env.HOME, '.md'))

spawn(bin, args)
  .on('exit', process.exit.bind(process, 0))
  .stderr.pipe(process.stderr)
