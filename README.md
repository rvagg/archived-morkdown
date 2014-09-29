# Morkdown

***A beautifully simple editor for Markdown documents***

[![NPM](https://nodei.co/npm/morkdown.png?downloads=true&downloadRank=true)](https://nodei.co/npm/morkdown/)
[![NPM](https://nodei.co/npm-dl/morkdown.png?months=6&height=3)](https://nodei.co/npm/morkdown/)

Morkdown is primarily designed to render [GitHub Flavored Markdown](http://github.github.com/github-flavored-markdown/) (GFM), so it's ideal for your **README.md**. When rendering the Markdown, it uses the same syntax highlighter as GitHub (the Python [Pygments](http://pygments.org/) library) and the styling is near identical to GitHub. Markdown content is parsed using [marked](https://github.com/chjj/marked), a JavaScript Markdown parser capable of parsing GFM.

![WOW!!!](http://r.va.gg/morkdown/screenshot-1.png)

*Morkdown editing the [LevelUP](https://github.com/rvagg/node-levelup) README*

Morkdown is a **Google Chrome App** coupled to a Node server and uses [CodeMirror](http://codemirror.net) for the editor panel.

![GFM you say?](http://r.va.gg/morkdown/screenshot-2.png)

*Morkdown editing the [LevelUP](https://github.com/rvagg/node-levelup) README with the "monokai" theme*

Morkdown will **automatically save** your document as you edit it.

## Themes

Morkdown is packaged with the standard CodeMirror themes, you can switch to a different theme with the `--theme <themename>` commandline argument:

  * ambiance
  * ambiance-mobile
  * blackboard
  * cobalt
  * eclipse
  * elegant
  * erlang-dark
  * lesser-dark
  * midnight
  * monokai
  * neat
  * night
  * rubyblue
  * solarized
  * twilight
  * vibrant-ink
  * xq-dark
  * xq-light

The default theme is **neat** but you can set your own default theme by saving a JSON file in your home directory named *.morkdownrc* with the following content: `{ "theme": "themename" }`. (My theme of choice is *monokai*).

## Installing & Using

You'll need Google Chrome of course, plus you'll need a python interpreter on your system to get the syntax highlighting working&mdash;which should be fine for Linux and Mac users. Getting it running on Windows might be a little tricky (but presumably not impossible!).

You can install from [npm](http://npmjs.org), the Node.js package manager, with <b><code>npm install -g morkdown</code></b> (you may need to `sudo` that depending on your setup). Once installed you can simply run the **`morkdown <path to file.md>`** command and you're away!

If you want to use an editor of your choice, launch morkdown with a *watch flag*, e.g. **`morkdown -w <path to file.md>`** and morkdown will re-render the output in the browser when the file is saved locally.

## Contributors

**morkdown** is brought to you by the following hackers:

 * [Rod Vagg](https://github.com/rvagg)
 * [Ian Duffy](https://github.com/imduffy15)
 * [ralphtheninja](https://github.com/ralphtheninja)

## Licence & Copyright

Morkdown is Copyright (c) 2013 Rod Vagg <@rvagg> and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.

Morkdown contains remnants of **[me](http://github.com/juliangruber/me/)**, which is Copyright (c) 2013 Julian Gruber <julian@juliangruber.com> and licenced under the MIT licence.rubyblue.css