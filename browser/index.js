var ready = require('domready');
var fs = require('fs');
var request = require('hyperquest');
var debounce = require('debounce');
var concat = require('concat-stream');

/**
 * DOM elements.
 */

var $input
var $output

/**
 * Transmit contents to server.
 */

var handleResponse = function (err, res) {
  if (!err && !res) err = 'server down.';
  if (err) return alert(err);
  if (res == 'stale') return; // ignore

  res = JSON.parse(res)
  if (res.error) return alert(res.error);

  if (res.content) $output.innerHTML = res.content
  else alert('no content returned from server')
}

var transmit = debounce(function () {
  var req = request.post('/content');
  req.setHeader('Content-Type', 'application/json');
  req.pipe(concat(handleResponse));
  req.write(JSON.stringify({
    ts : Date.now(),
    content : $input.value
  }));
  req.end();
}, 200, false);

ready(function () {
  $input = document.querySelector('#input > textarea')
  $output = document.querySelector('#output > div')

  $input.addEventListener('keyup', transmit);
});

/**
 * Snippets.
 *
 * @TODO Insert into text area
 */

var snippets = {
  MIT : fs.readFileSync(__dirname + '/../snippets/mit.txt')
}

/**
 * Bring app to focus.
 * @TODO
 */

//window.addEventListener('load', window.focus.bind(window));