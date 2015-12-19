TODO
====

/ install brunch
/ initial commit
/ write some es6
/ babel build it
/ write a dummy test
/ set up karma, or equivalent
- start writing setlup code via TDD
- use old trip-expenses for actual logic
    - split up into modules, if appropriate
    - write tests for each module
    - write tests for wrapper I'll write

Thoughts
--------

So, webpack is pretty awesome. May well end up using that.

Brunch is a little bit inflexible. What do I *really* want:
- es6
- testing

Later on, I might want to add things like appcache support and so on... One
thing at a time.

That said... why not let Brunch build my JS, and have karma load that compiled
file. But then, what about the tests themselves? Perhaps a karma preprocessor?

Fine - continue with Brunch, run karma separately.

In fact, I can use karma-babel-preprocessor:

  module.exports = function(config) {
    config.set({
      files: [
        "src/**/*.js",
        "test/**/*.js"
      ],
      preprocessors: {
        "src/**/*.js": ["babel"],
        "test/**/*.js": ["babel"]
      },
      "babelPreprocessor": {
        // options go here
      }
    });
  };

also install phantomjs, jasmine-core
