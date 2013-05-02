#!/usr/bin/env node

var me = require('..');
var spawn = require('child_process').spawn;
var os = require('os');
var path = require('path');

var file = process.argv[2];
var port = 3456;
var server = me(file, port).listen(port);

/**
 * Spawn Chrome app.
 */

var bin = 'google-chrome';
var args = [ '--app=http://localhost:' + port, '--disk-cache-size 0' ];

if (os.platform() == 'darwin') {
  bin = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}
if (process.env.HOME) {
  args.push('--user-data-dir=' + path.join(process.env.HOME, '.md'));
}

ps = spawn(bin, args);
ps.stderr.pipe(process.stderr);
ps.on('exit', process.exit.bind(process, 0));