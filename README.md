[![Build Status](https://travis-ci.org/ikondrat/franky.png?branch=master)](https://travis-ci.org/ikondrat/franky)

Franky.js
======
JavaScript framework for everyday usage

Environments to use
--------------------------------------
Franky is isomorphic JavaScript library.
It may be executed on server side with a help of any javascript engine or on client side in browser


Requirements to build Franky
--------------------------------------
You need to have the latest Node.js/npm and git 1.7 or later.

For Windows, you may download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users may install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users may use appropriate package managers to install git and Node.js, or build from sources.

How to build Franky
----------------------------
Clone a copy of git repo by running:

```bash
git clone git@github.com:ikondrat/franky.git
```

Enter the franky directory and run the build script:

```bash
cd franky && npm run build
```

The built version of franky will be put in the `lib/` subdirectory.

### Modules
The default configuration file `conf/default.js` will be used due build process.

Mind what it is linked as `src/franky.js`.

You may have another list of modules to build.
For what case change link `src/franky.js` to your modified configuration file and run `npm run build`

Running the Unit Tests
--------------------------------------
Start `npm test` to auto-build franky and run tests:

```bash
cd franky && npm test
```

Annotated source
--------------------------------------
You may see [annotated source](http://ikondrat.github.io/franky/franky.html)