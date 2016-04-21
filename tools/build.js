const webpack = require('webpack');
const webpackConfigBuilder = require('../webpack.config');
const webpackConfig = webpackConfigBuilder('production');
require('colors');

process.env.NODE_ENV = 'production';

webpack(webpackConfig).run((err, stats) => {
  console.log('Generating production-ready site.'.bold.blue);

  if (err) {
    console.log(err.bold.red);
    return 1;
  }

  const jsonStats = stats.toJson();
  if (jsonStats.hasErrors) return jsonStats.errors.map(error => console.log(error.red));
  if (jsonStats.hasWarnings) {
    console.log('Webpack warnings: '.bold.yellow);
    jsonStats.warnings.map(warning => console.log(warning.yellow));
  }

  console.log('Production-ready site available in dist folder.'.green.bold);
  return 0;
});
