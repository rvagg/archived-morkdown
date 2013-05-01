var marked = require('marked');
var ready = require('domready');
var hljs = require('highlight.js');
var fs = require('fs');
var request = require('hyperquest');
var debounce = require('debounce');
var concat = require('concat-stream');

/**
 * DOM elements.
 */

var input = document.createElement('textarea');
var output = document.createElement('div');

/**
 * Transmit contents to server.
 */

var transmit = debounce(function () {
  var req = request.post('/content');
  req.setHeader('Content-Type', 'application/json');
  req.pipe(concat(function (err, res) {
    if (!err && !res) err = 'server down.';
    if (!err && res != 'ok') err = res;
    if (err) console.error(err);
  }));
  req.write(JSON.stringify({
    ts : Date.now(),
    content : input.value
  }));
  req.end();
}, 200, false);

/**
 * Render.
 */

function render () {
  output.innerHTML = marked(input.value, {
    gfm : true,
    highlight : function(code, lang) {
      if (lang == 'js') lang = 'javascript';
      if (lang && hljs.LANGUAGES[lang]) {
        return hljs.highlight(lang, code).value;
      }
      return hljs.highlightAuto(code).value;
    }
  });
}

/**
 * Wire up input and output.
 */

input.addEventListener('keyup', function (ev) {
  render();
  transmit();
});

ready(function () {
  document.querySelector('#input').appendChild(input);
  document.querySelector('#output').appendChild(output);
});

/**
 * Load content initially.
 */

request('/content').pipe(concat(function (err, res) {
  if (err) return alert(err);
  if (!res) return;
  input.value = res;
  render();
}));

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
