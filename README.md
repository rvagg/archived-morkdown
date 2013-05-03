# Morkdown

***A beautifully simple editor for Markdown documents***

![WOW!!!](https://f.cloud.github.com/assets/495647/452413/a9bf510a-b2e5-11e2-8417-1d8d49b7a6f3.png)

Morkdown is primarily designed to render [GitHub Flavored Markdown](http://github.github.com/github-flavored-markdown/) (GFM), so it's ideal for your **README.md**. It uses the same syntax highlighter as GitHub (the Python [Pygments](http://pygments.org/) library) and the styling is near identical to GitHub. Markdown content is parsed using [marked](https://github.com/chjj/marked), a JavaScript Markdown parser capable of parsing GFM.

Morkdown is a **Google Chrome App**. The previous incarnation of Morkdown was built on [AppJS](http://appjs.org/), but that project has gone a little stale of late so thanks to [@juliangruber](http://github.com/juliangruber/)'s **[me](http://github.com/juliangruber/me/)** markdown editor I've resurrected Morkdown from the dead!

![GFM you say?](https://f.cloud.github.com/assets/495647/452414/afb7b674-b2e5-11e2-85a5-da9b95f89d7e.png)

Morkdown will **automatically save** your document as you edit it.

## Installing & Using

You'll need Google Chrome of course, plus you'll need a python interpreter on your system to get the syntax highlighting working&mdash;which should be fine for Linux and Mac users. Getting it running on Windows might be a little tricky (but presumably not impossible!).

You can install from [npm](http://npmjs.org), the Node.js package manager, with <b><code>npm install -g morkdown</code></b> (you may need to `sudo` that depending on your setup). Once installed you can simply run the **`morkdown <path to file.md>`** command and you're away!

## Licence & Copyright

Morkdown is Copyright (c) 2013 Rod Vagg <@rvagg> and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.

Morkdown contains remnants of **[me](http://github.com/juliangruber/me/)**, which is Copyright (c) 2013 Julian Gruber <julian@juliangruber.com> and licenced under the MIT licence.