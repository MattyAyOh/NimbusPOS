module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],

    files: [ 'app/javascript/**/*.spec.js' ],
    exclude: [ 'app/javascript/packs/*.js' ],

    preprocessors: {
      'app/javascript/**/*.spec.js': ["webpack"]
    },

    webpack: require("./config/webpack/test.js"),
    webpackMiddleware: {
      stats: "errors-only"
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    // browsers: ['Chrome', 'Firefox', 'PhantomJS'],
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
