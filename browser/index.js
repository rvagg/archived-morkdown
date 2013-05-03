var ready             = require('domready')
  , request           = require('hyperquest')
  , cumulativeDelayed = require('delayed').cumulativeDelayed
  , concat            = require('concat-stream')

  , $input
  , $output
  , inTransit         = false

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

  inTransit = true
  var req = request.post('/content')
  req.setHeader('Content-Type', 'application/json')
  req.pipe(concat(handleResponse))
  req.write(JSON.stringify({
    ts : Date.now(),
    content : $input.value
  }))
  req.end()
}, 0.3)

ready(function () {
  $input = document.querySelector('#input > textarea')
  $output = document.querySelector('#output > div')

  $input.addEventListener('keyup', transmit)
})