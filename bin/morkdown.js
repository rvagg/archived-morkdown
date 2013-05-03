#!/usr/bin/env node

var me     = require('..')
  , spawn  = require('child_process').spawn
  , os     = require('os')
  , fs     = require('fs')
  , path   = require('path')
  , file   = process.argv[2]
  , port   = 3456

  , bin    = 'google-chrome'
  , args   = [
        '--app=http://localhost:' + port
      , '--disk-cache-size 0'
      , '--no-proxy-server'
    ]
  , isFile = file && fs.existsSync(file) && fs.statSync(file).isFile()

if (file && !isFile) {
  console.error('File [' + file + '] does not exist or is not a regular file')
  file = null
}

if (!file) {
  console.error('Usage: morkdown <path to file.md>')
  process.exit(-1)
}

me(file, port).listen(port)

if (os.platform() == 'darwin')
  bin = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

if (process.env.HOME)
  args.push('--user-data-dir=' + path.join(process.env.HOME, '.md'))

spawn(bin, args)
  .on('exit', process.exit.bind(process, 0))
  .stderr.pipe(process.stderr)
