var ready             = require('domready')
  , request           = require('hyperquest')
  , cumulativeDelayed = require('delayed').cumulativeDelayed
  , concat            = require('concat-stream')

  , $codeMirror
  , $output
  , inTransit         = false
  , lastText

require('./codemirror')

var handleResponse = function (err, res) {
  inTransit = false

  if (!err && !res)
    return alert('server down, server down, panic!!')

  if (err)
    return alert(err)

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
  var $input = document.querySelector('#input > textarea')
  $output = document.querySelector('#output > div')
  $codeMirror = CodeMirror.fromTextArea($input, {
      mode         : 'gfm'
    , lineNumbers  : true
    , theme        : document.body.getAttribute('data-theme') || 'neat'
    , lineWrapping : true
    , tabSize      : 2
    , autofocus    : true
  });
  lastText = $codeMirror.getValue()
  $codeMirror.on('change', transmit)
})