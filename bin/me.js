#!/usr/bin/env node

var me = require('..');
var spawn = require('child_process').spawn;
var os = require('os');
var path = require('path');

var file = process.argv[2];
var server = me(file);

/**
 * Start server.
 */

var port = server.listen(function () {
  // console.log('Edit "%s" at http://localhost:%s/', file, port);
}).address().port;

/**
 * Spawn Chrome app.
 */

var bin = 'google-chrome';
var args = [ '--app=http://localhost:' + port ];

if (os.platform() == 'darwin') {
  bin = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  args.push('--user-data-dir=' + path.join(process.env.HOME, '.md'));
}

ps = spawn(bin, args);
ps.stderr.pipe(process.stderr);
