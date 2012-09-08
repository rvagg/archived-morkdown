var spawn = require('child_process').spawn
  , path  = require('path')

module.exports = function (lang, code, callback) {
  var exec = spawn(path.join(__dirname, '../pygments/pygmentize'), [ '-f', 'html', '-l', lang, '-P', 'encoding=utf8' ])
    , stdout = ''
    , stderr = ''
  exec.stdout.on('data', function (data) {
    stdout += data
  })
  exec.stderr.on('data', function (data) {
    stderr += data
  })
  exec.on('exit', function (code) {
    if (code !== 0) return callback('Error: ' + stderr)
    callback(null, stdout)
  })
  exec.stdin.write(code)
  exec.stdin.end()
}