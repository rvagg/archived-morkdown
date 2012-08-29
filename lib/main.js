var fs                = require('fs')
  , app               = require('appjs')
  , path              = require('path')
  , pap               = require("posix-argv-parser")

  , Processor         = require('./processor')
  , cumulativeDelayed = require('./util').cumulativeDelayed

  , args              = pap.create()
  , v                 = pap.validators

  , window

  , currentProcessor  = null
  , currentText       = null

  , $ = function (id) {
      return window.document.getElementById(id)
    }

  , render = cumulativeDelayed(function (content) {
      if (currentProcessor != null) return render(content)
      if (content === currentText) return

      currentProcessor = new Processor(currentText = content)
      currentProcessor.process(function (err, html) {
        currentProcessor = null
        if (err) return console.log('ERR', err)
        $('dst').innerHTML = html
      })
    }, 0.3)

  , keyupListener = function (event) {
      render(event.target.value)
    }

  , renderFile = function (file) {
      fs.readFile(file, 'utf8', function (err, content) {
        if (err) return console.log('Error reading watch file: ' + err)
        render(content)
      })
    }

  , watchFileListener = function (file, currStat, prevStat) {
      if (currStat.mtime == prevStat.mtime) return
      renderFile(file)
    }

  , start = function (watchFile) {
      app.serveFilesFrom(path.join(__dirname, '../content'))

      window = app.createWindow({
        width  : 800,
        height : 800,
        icons  : path.join(__dirname,  '../content/icons')
      })

      window.on('create', function(){
        window.frame.show()
        window.frame.center()
      })

      window.on('close', function(){
        process.exit(0)
      })

      window.on('ready', function(){
        window.require = require
        window.process = process
        window.module = module

        window.addEventListener('keydown', function(e){
          if (e.keyIdentifier === 'F12') {
            window.frame.openDevTools()
          }
        })

        var $src = $('src')
          , $dst = $('dst')

        $dst.addEventListener('click', function (event) {
          event.preventDefault()
        })

        if (watchFile) {
          fs.watchFile(watchFile, { interval: 1000 }, watchFileListener.bind(null, watchFile))
          renderFile(watchFile)
          window.document.body.classList.add('watching')
        } else {
          $src.addEventListener('keyup', keyupListener)
          $src.focus()
        }
      })
    }

args.createOption(["-w", "--watch"], {
    defaultValue: null
  , signature: "Markdown file to render whenever changes are detected"
  , validators: [ v.file() ]
})

args.parse(process.argv.slice(2), function (errors, options) {
    if (errors)
      return console.log(errors[0])

    start(options['--watch'].isSet && options['--watch'].value)
})