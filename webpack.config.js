const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const autoprefixer = require('autoprefixer');
const path = require('path');

const getPlugins = env => {
  const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env),
    __DEV__: env === 'development',
  };

  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new HtmlWebpackPlugin({ template: 'index.html', favicon: 'favicon.png' }),
    new ExtractTextPlugin('styles.css'),
  ];

  if (env === 'development') {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new StyleLintPlugin({ syntax: 'scss' }),
      new WebpackNotifierPlugin({ excludeWarnings: true })
    );
  } else {
    plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: false })
    );
  }

  return plugins;
};

const getLoaders = env => {
  const cssLoadersObj = env === 'development' ?
    { test: /\.css$/, loaders: ['style', 'css?sourceMap', 'postcss'] } :
    { test: /\.css$/, loader: ExtractTextPlugin.extract(['css', 'postcss']) };

  const scssLoadersObj = env === 'development' ?
    { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass?sourceMap'] } :
    { test: /\.scss$/, loader: ExtractTextPlugin.extract(['css', 'postcss', 'sass']) };

  const imageLoaders = ['url?limit=10000'];
  if (env === 'production') {
    imageLoaders.push(
      'image-webpack?{ optimizationLevel: 7, progressive: true, pngquant: { quality: "65-90" } }'
    );
  }

  return [
    {
      test: /\.js$/,
      loaders: ['babel?compact=true&comments=false', 'eslint'],
    },
    {
      test: /\.json$/,
      loader: 'json',
    },
    cssLoadersObj,
    scssLoadersObj,
    {
      test: /\.html$/,
      loader: 'html',
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/,
      loaders: imageLoaders,
    },
    {
      test: /\.(eot(\?v=\d+\.\d+\.\d+)?|ttf(\?v=\d+\.\d+\.\d+)?|svg(\?v=\d+\.\d+\.\d+)?|woff(2)*)$/,
      loader: 'url?limit=10000',
    },
  ];
};

const getEntry = env => {
  const entry = ['./scripts/main'];
  if (env === 'development') entry.push('webpack-hot-middleware/client?reload=true');

  return entry;
};

module.exports = env => (
  {
    context: path.join(__dirname, './src'),
    debug: true,
    devtool: env === 'development' ? 'eval-source-map' : 'eval',
    noInfo: true,
    entry: getEntry(env),
    output: {
      path: path.join(__dirname, './dist'),
      publicPath: '',
      filename: 'scripts.js',
    },
    plugins: getPlugins(env),
    module: {
      loaders: getLoaders(env),
    },
    postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
    resolve: {
      extensions: ['', '.js'],
    },
  }
);
