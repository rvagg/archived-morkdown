var express = require('express');
var browserify = require('browserify');
var brfs = require('brfs');
var fs = require('fs');

module.exports = me;

/**
 * Mardown editor.
 */

function me (file) {
  var app = express();

  app.use(express.static(__dirname + '/static'));
  app.use(express.json());

  app.get('/bundle.js', function (req, res) {
    res.status(200).type('js');
    browserify(__dirname + '/browser/index.js')
      .transform(brfs).bundle().pipe(res);
  });

  app.get('/content', function (req, res) {
    res.sendfile(file);
  });

  var lastTransmission;

  app.post('/content', function (req, res) {
    var ts = req.body.ts;
    var content = req.body.content;

    if (lastTransmission && ts < lastTransmission) return res.end('ok');

    fs.writeFileSync(file, content);
    res.end('ok');
  });

  return app;
}
