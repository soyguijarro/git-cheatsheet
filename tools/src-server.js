const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfigBuilder = require('../webpack.config');
const webpackConfig = webpackConfigBuilder('development');

const bundler = webpack(webpackConfig);

browserSync({
  server: {
    baseDir: 'src',
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true },
        noInfo: true,
      }),
      webpackHotMiddleware(bundler),
    ],
  },
  files: [
    'src/*.html',
  ],
  notify: false,
  ghostMode: false,
});
