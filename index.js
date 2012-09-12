var fs                = require('fs')
  , app               = require('appjs')
  , path              = require('path')
  , pap               = require("posix-argv-parser")

  , brucedown         = require('brucedown')
  , cumulativeDelayed = require('delayed').cumulativeDelayed

  , args              = pap.create()
  , v                 = pap.validators

  , window

  , processing        = false
  , currentText       = null

  , $ = function (id) {
      return window.document.getElementById(id)
    }

  , render = cumulativeDelayed(function (content) {
      if (processing) return render(content)
      if (content === currentText) return

      processing = true
      brucedown(currentText = content, function (err, html) {
        processing = false
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
      app.serveFilesFrom(path.join(__dirname, './content'))

      window = app.createWindow({
        width  : 800,
        height : 800,
        icons  : path.join(__dirname,  './content/icons')
      })

      window.on('create', function(){
        window.frame.show()
        window.frame.center()
      })

      window.on('close', function(){
        process.exit(0)
      })

      window.on('ready', function(){
        var $src = $('src')
          , $dst = $('dst')
          , $hrefhover = $('hrefhover')
          , hunta = function (t) {
              while (t.tagName != 'A' && t != $dst) t = t.parentNode
              return t.tagName == 'A' && t.href && t
            }

        window.addEventListener('keydown', function(e){
          if (e.keyIdentifier === 'F12')
            window.frame.openDevTools()
        })

        $dst.addEventListener('click', function (event) {
          event.preventDefault()
        })

        $dst.addEventListener('mouseover', function (event) {
          if ($hrefhover.classList.contains('hide')) {
            var t = hunta(event.target)
            if (t) {
              $hrefhover.innerHTML = t.href.replace('&', '&amp;').replace('>', '&gt;').replace('<', '&lt;')
              $hrefhover.classList.remove('hide')
              $hrefhover.style.display = 'block'
              //console.log('display:',$hrefhover.style.display)
            }
          }
        })
        $dst.addEventListener('mouseout', function (event) {
          if (!$hrefhover.classList.contains('hide')) {
            var t = hunta(event.target)
            if (t) {
              $hrefhover.classList.add('hide')
            }
          }
        })
        $hrefhover.addEventListener('webkitTransitionEnd', function () {
          if (window.getComputedStyle($hrefhover).opacity === 0) {
            $hrefhover.style.display = 'none'
              //console.log('display:',$hrefhover.style.display)
          }
        })

        if (watchFile) {
          //TODO: be a nice app and unwatch this file before exit...
          fs.watchFile(watchFile, { interval: 1000 }, watchFileListener.bind(null, watchFile))
          renderFile(watchFile)
          window.document.body.classList.add('watching')
          window.document.title += ' - ' + watchFile
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