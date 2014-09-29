var ready    = require('domready')
  , request  = require('hyperquest')
  , debounce = require('delayed').debounce
  , concat   = require('concat-stream')
  , shoe     = require('shoe')
  , through  = require('through')
  , become   = require('become')

  , $codeMirror
  , $output
  , inTransit         = false
  , lastText

require('./codemirror')


var transmitDelayed = debounce(transmit, 300)


function handleResponse (res) {
  inTransit = false

  if (res == 'stale')
    return // ignore

  res = JSON.parse(res)

  if (res.error)
    return alert(res.error)

  become($output, res.content ? res.content : '', {inner: true})
}


function transmit () {
  if (inTransit)
    return

  var content = $codeMirror.getValue()
    , req

  if (lastText == content)
    return

  lastText = content

  inTransit = true

  req = request.post(window.location.href + 'content')
  req.setHeader('Content-Type', 'application/json')
  req.pipe(concat(handleResponse))
  req.write(JSON.stringify({
    ts : Date.now(),
    content : content
  }))
  req.end()
}


function onReady () {
  var $input = document.querySelector('#input')
    , $textarea
    , stream

  $output = document.querySelector('#output > div')

  if ($input.style && $input.style.display && $input.style.display == 'none') {
    // pushing changes to client when file changed locally
    stream = shoe('/output')
    stream.pipe(through(handleResponse))
  }
  else {
    // input from browser to server (save file) and result back to client
    $textarea = document.querySelector('#input > textarea')
    $codeMirror = CodeMirror.fromTextArea($textarea, {
      mode         : 'gfm'
      , lineNumbers  : true
      , theme        : document.body.getAttribute('data-theme') || 'neat'
      , lineWrapping : true
      , tabSize      : 2
      , autofocus    : true
    });
    lastText = $codeMirror.getValue()
    $codeMirror.on('change', transmitDelayed)
  }
}


ready(onReady)
