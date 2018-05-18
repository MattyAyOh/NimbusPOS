const environment = require('./environment')

babel = environment.loaders.get('babel')
babel.exclude = /\.spec\.js/

module.exports = environment.toWebpackConfig()
