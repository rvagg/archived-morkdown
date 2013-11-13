var ready             = require('domready')
  , request           = require('hyperquest')
  , cumulativeDelayed = require('delayed').cumulativeDelayed
  , concat            = require('concat-stream')
  , shoe              = require('shoe')
  , through           = require('through')

  , $codeMirror
  , $output
  , inTransit         = false
  , lastText

require('./codemirror')

var handleResponse = function (res) {
  inTransit = false

  if (res == 'stale')
    return // ignore

  res = JSON.parse(res)

  if (res.error)
    return alert(res.error)

  if (res.content)
    $output.innerHTML = res.content
  else
    alert('no content returned from server')
}

var transmit = cumulativeDelayed(function () {
  if (inTransit)
    return

  var content = $codeMirror.getValue()
    , req

  if (lastText == content)
    return

  lastText = content

  inTransit = true
  req = request.post('/content')
  req.setHeader('Content-Type', 'application/json')
  req.pipe(concat(handleResponse))
  req.write(JSON.stringify({
    ts : Date.now(),
    content : content
  }))
  req.end()
}, 0.3)

ready(function () {
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
    $codeMirror.on('change', transmit)
  }
})
