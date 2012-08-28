var app               = require('appjs')
  , path              = require('path')

  , Processor         = require('./processor')
  , cumulativeDelayed = require('./util').cumulativeDelayed

  , currentProcessor  = null
  , currentText       = null

function $ (id) {
  return window.document.getElementById(id)
}

var render = cumulativeDelayed(function (content) {
  if (currentProcessor != null) return render(content)
  if (content === currentText) return

  currentProcessor = new Processor(currentText = content)
  currentProcessor.process(function (err, html) {
    currentProcessor = null
    if (err) return console.log('ERR', err)
    $('dst').innerHTML = html
  })
}, 0.3)

function keyupListener (event) {
  render(event.target.value)
}

app.serveFilesFrom(path.join(__dirname, '../content'))

var window = app.createWindow({
  width  : 800,
  height : 800,
  icons  : path.join(__dirname,  '../content/icons')
})

window.on('create', function(){
  window.frame.show()
  window.frame.center()
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

  $src.addEventListener('keyup', keyupListener)
  $dst.addEventListener('click', function (event) {
    event.preventDefault()
  })

  $src.focus()
})

window.on('close', function(){
  process.exit(0)
})