# Morkdown
***A simple editor for Markdown***

![WOW!!!](http://js.vagg.org/github/morkdown.png)

Morkdown is primarily designed to render [GitHub Flavored Markdown](http://github.github.com/github-flavored-markdown/) (GFM), so it's ideal for your **README.md**.

Morkdown is built on [AppJS](http://appjs.org/), an application framework for Node.js. Editing takes place in a two-pane window, your source Markdown on the left and the rendered HTML on the right. The styling is almost identical to Markdown rendered on GitHub. Markdown is parsed using [marked](https://github.com/chjj/marked), a JavaScript Markdown parser capable of parsing GFM while syntax highlighting is performed using the [Python Pygments](http://pygments.org/) library, used by GitHub.

## Edit mode

If you run `morkdown` without any arguments you'll enter a simple *edit mode*. You'll have a panel on the left where you can type (or paste) your Markdown and it'll be rendered in a panel on the right. There is no file-load or save functionality here so copy and paste are your friends.

## Watch mode

If you run `morkdown --watch <file>` (also `-w <file>`) you'll enter a *watch mode* where Morkdown acts as a renderer for the Markdown file you've provided. It'll continue to watch for changes to that file and re-render the content automatically. That way, you can use your favourite editor instead of the lame in-built textarea!

![Watch mode](http://js.vagg.org/github/morkdown_watchmode.png)
*Morkdown in "watch mode"*

## Installing & Using

AppJS *should* work on Linux, Mac OS X and Windows.

**Mac OS X users need to be using the 32-bit version of Node unfortunately.** This is a Chromium limitation, you can apply pressure by starring [this ticket](http://code.google.com/p/chromium/issues/detail?id=18323).

You'll need a python interpreter on your system, which should be fine for Linux and Mac users. Getting it running on Windows might be a little tricky (but presumably not impossible!).

You can install from [npm](http://npmjs.org) with `npm install -g morkdown` (you may need to `sudo` that depending on your setup). Once installed you can simply run the **`morkdown`** command and you're away!

## Contributing

**YES PLEASE!** My needs are simple but I can see lots of potential for this project. AppJS lets you develop in JavaScript, HTML & CSS so the barriers to entry are fairly low.

## Licence & Copyright

Morkdown is Copyright (c) 2012 Rod Vagg <@rvagg> and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.