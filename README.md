# Morkdown
***A simple editor for Markdown***

![WOW!!!](http://js.vagg.org/github/morkdown.png)

Morkdown is primarily designed to render [GitHub Flavored Markdown](http://github.github.com/github-flavored-markdown/) (GFM), so it's ideal for your **README.md**.

Morkdown is built on [AppJS](http://appjs.org/), an application framework for Node.js. Editing takes place in a two-pane window, your source Markdown on the left and the rendered HTML on the right. The styling is almost identical to Markdown rendered on GitHub. Markdown is parsed using [marked](https://github.com/chjj/marked), a JavaScript Markdown parser capable of parsing GFM while syntax highlighting is performed using the [Python Pygments](http://pygments.org/) library, used by GitHub.

## Status

Currently all you can do is edit and watch your Markdown render, there is no file-load or save functionality so copy and paste are your friends.

## Installing & Using

AppJS claims to work on Linux, Mac OS X and Windows.

**Mac OS X users need to be using the 32-bit version of Node unfortunately.** This is a Chromium limitation, you can apply pressure by starring [this ticket](http://code.google.com/p/chromium/issues/detail?id=18323).

You'll need a python interpreter on your system, which should be fine for Linux and Mac users. Getting it running on Windows might be a little tricky (but presumably not impossible!).

You can install from [npm](http://npmjs.org) with `npm install -g morkdown` (you may need to `sudo` that depending on your setup). Once installed you can simply run the **`morkdown`** command and you're away!

## Contributing

**YES PLEASE!** My needs are simple but I can see lots of potential for this project. AppJS lets you develop in JavaScript, HTML & CSS so the barriers to entry are fairly low.

## Licence & Copyright

Morkdown is Copyright (c) 2012 Rod Vagg <@rvagg> and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.