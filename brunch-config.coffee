module.exports = config:
    files:
        javascripts:
          joinTo:
            'app.js': /^app/
    plugins:
        eslint:
            warnOnly: no
