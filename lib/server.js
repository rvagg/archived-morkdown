var path       = require('path')
  , http       = require('http')
  , st         = require('st')
  , browserify = require('browserify')
  , fs         = require('fs')
  , brucedown  = require('brucedown')
  , after      = require('after')
  , bl         = require('bl')
  , ent        = require('ent')
  , shoe       = require('shoe')

  , staticPath = path.join(__dirname, '../static')

function writeHead (res, contentType) {
  res.writeHead(200, {
      'Content-Type': contentType
    , 'Cache-Control': 'no-cache'
  })
}

// constructor
function Morkdown (file, theme, watching) {
  if (!(this instanceof Morkdown)) return new Morkdown(file, theme, watching)

  // file we're editing
  this.file  = file
  this.theme = theme || 'neat'

  // static resources
  this.mount = st({
      path  : staticPath
    , url   : '/'
    , cache : false
    , dot   : true
    , passthrough : false
  })

  // hide input and expand output if we are watching changes to file
  this.watching = watching
  this.inputStyle = this.watching ? 'style="display: none;"' : ''
  this.outputStyle = this.watching ? 'style="left: 0%"' : ''

  this.server = http.createServer(function (req, res) {
    // first try to handle it locally, then handler() will defer to st if needed
    this.handler(req, res)
  }.bind(this))
}

// exportable
Morkdown.prototype.listen = function () {
  var sock

  this.server.listen.apply(this.server, arguments)

  if (!this.watching)
    return

  sock = shoe(function (stream) {
    var opts = { persistent: true, interval: 100 }
    fs.watchFile(this.file, opts, function () {
      fs.readFile(this.file, function (err, data) {
        brucedown(data, function (err, content) {
          stream.write(JSON.stringify({ content: content }))
        })
      })
    }.bind(this))

    stream.on('end', function () {
      fs.unwatchFile(this.file)
    }.bind(this))

  }.bind(this))

  sock.install(this.server, '/output')
}

// handle /bundle.js requests
Morkdown.prototype.handle_bundle_js = function(req, res) {
  writeHead(res, 'text/javascript')
  browserify(path.join(__dirname, '../browser/index.js'))
    .bundle()
    .pipe(res)
}

// handle / & /index.html requests
Morkdown.prototype.handle_ =
Morkdown.prototype.handle_index_html = function (req, res) {
  // read index.html, read file, render file as markdown
  // replace {input} and {output} in index.html with our
  // content, serve to the client
  var index, input, output

    , done = after(2, function (err) {
        if (err) {
          writeHead(res, 'application/json')
          return res.end(JSON.stringify({ error: err }))
        }

        // replace order matters here since {output} appears last in the file, we don't
        // want to replace "{output}" if it happens to exist in the input
        index = index
          .replace('{theme}', this.theme)
          .replace('{output}', output)
          .replace('{input}', input)
          .replace('{file}', this.file)
          .replace('{input-style}', this.inputStyle)
          .replace('{output-style}', this.outputStyle)

        writeHead(res, 'text/html')
        res.end(index)
      }.bind(this))

  fs.readFile(path.join(staticPath, 'index.html'), 'utf8', function (err, _index) {
    index = _index
    done(err)
  })

  fs.readFile(this.file, 'utf8', function (err, _input) {
    if (err)
      return done(err)

    brucedown(_input ,function (err, _output) {
      if (err)
        return done(err)

      input = ent.encode(_input)
      output = _output
      done()
    })
  })
}

// handle /content calls (assume it's a post that we can collect from)
Morkdown.prototype.handle_content = function (req, res) {
  req.pipe(bl(function (err, body) {
    if (err)
      return console.error(err) // whaaa??

    // write file (save) and render markdown & return

    var content, done

    body = JSON.parse(body.toString())

    // out of time request, ignore it
    if (this.lastTransmission && body.ts < this.lastTransmission) {
      writeHead(res, 'text/plain')
      return res.end('stale')
    }

    done = after(2, function (err) {
      var responseBody = {}
      if (err) {
        responseBody.error = err.message || err
        console.error(err.stack)
      } else {
        responseBody.content = content
      }

      writeHead(res, 'application/json')
      res.end(JSON.stringify(responseBody))
    })

    fs.writeFile(this.file, body.content, done)

    brucedown(body.content, function (err, _content) {
      content = _content
      done(err)
    })
  }.bind(this)))
}

// basic router that maps urls to this.handle_X function calls where
// X is the name of the request stripped of non-alphabetic characters
// and . replaced with _
Morkdown.prototype.handler = function(req, res) {
  var fn = 'handle_' + String(req.url)
      .toLowerCase()
      .replace(/[^a-z\.]/g, '')
      .replace(/\./g, '_')

  if (typeof this[fn] == 'function')
    return this[fn](req, res)

  // no match, defer to st mount point which will do 404 if required
  this.mount(req, res)
}

module.exports = Morkdown
