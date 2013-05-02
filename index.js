var path = require('path');
var http = require('http');
var st = require('st');
var browserify = require('browserify');
var brfs = require('brfs');
var fs = require('fs');
var brucedown = require('brucedown');
var after = require('after');
var concat = require('concat-stream');
var ent = require('ent');

module.exports = Me;

var staticPath = path.join(__dirname, './static');

function renderMarkdown (markdown, callback) {
  brucedown(markdown, callback);
}

function writeHead (res, contentType) {
  res.writeHead(200, {
      'Content-Type': contentType
    , 'Cache-Control': 'no-cache'
  });
}

// constructor
function Me (file) {
  if (!(this instanceof Me)) return new Me(file);

  // file we're editing
  this.file = file;

  // static resources
  this.mount = st({
      path  : staticPath
    , url   : '/'
    , cache : false
    , passthrough : false
  });

  this.server = http.createServer(function (req, res) {
    // first try to handle it locally, then handler() will defer to st if needed
    this.handler(req, res)
  }.bind(this));
}

// exportable
Me.prototype.listen = function () {
  this.server.listen.apply(this.server, arguments)
};

// handle /bundle.js requests
Me.prototype.handle_bundle_js = function(req, res) {
  writeHead(res, 'text/javascript')
  browserify(__dirname + '/browser/index.js')
    .transform(brfs)
    .bundle()
    .pipe(res);    
}

// handle / & /index.html requests
Me.prototype.handle_ =
Me.prototype.handle_index_html = function (req, res) {
  // read index.html, read file, render file as markdown
  // replace {input} and {output} in index.html with our
  // content, serve to the client
  var index, input, output;

  var done = after(2, function (err) {
    if (err) {
      writeHead(res, 'application/json')
      return res.end(JSON.stringify({ error: err }));
    }

    // replace order matters here since {output} appears last in the file, we don't
    // want to replace "{output}" if it happens to exist in the input
    index = index
      .replace('{output}', output)
      .replace('{input}', input)

    writeHead(res, 'text/html')
    res.end(index);
  });

  fs.readFile(path.join(staticPath, 'index.html'), 'utf8', function (err, _index) {
    index = _index;
    done(err);
  });

  fs.readFile(this.file, 'utf8', function (err, _input) {
    if (err) return done(err);
    renderMarkdown(_input ,function (err, _output) {
      if (err) return done(err);
      input = ent.encode(_input);
      output = _output;
      done();
    });
  });
};

// handle /content calls (assume it's a post that we can collect from)
Me.prototype.handle_content = function (req, res) {
  req.pipe(concat(function (err, body) {
    if (err) return console.error(err); // whaaa??

    // write file (save) and render markdown & return

    var content;
    body = JSON.parse(body);

    // out of time request, ignore it
    if (this.lastTransmission && body.ts < this.lastTransmission) {
      writeHead(res, 'text/plain')
      return res.end('stale');
    }

    var done = after(2, function (err) {
      var responseBody = {};
      if (err) {
        responseBody.error = err.message;
        console.error(err.stack);
      } else {
        responseBody.content = content;
      }
      writeHead(res, 'application/json')
      res.end(JSON.stringify(responseBody));
    });

    fs.writeFile(this.file, body.content, done);

    brucedown(body.content, function (err, _content) {
      content = _content;
      done(err);
    });
  }.bind(this)));
};

// basic router that maps urls to this.handle_X function calls where
// X is the name of the request stripped of non-alphabetic characters
// and . replaced with _
Me.prototype.handler = function(req, res) {
  var fn = 'handle_' + String(req.url)
      .toLowerCase()
      .replace(/[^a-z\.]/g, '')
      .replace(/\./g, '_');

  if (typeof this[fn] == 'function')
    return this[fn](req, res);

  // no match, defer to st mount point which will do 404 if required
  this.mount(req, res);
};