const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');

// Helpers
const isProd = env => env === 'production';
const isDev = env => env === 'development';
const getIfDev = env => x => (isDev(env) ? x : undefined);
const getIfProd = env => x => (isProd(env) ? x : undefined);
const removeUndefined = array => array.filter(x => x !== undefined);

// Config constants
const SOURCE_DIR = 'src';
const OUTPUT_DIR = 'dist';
const SOURCE_HTML_FILE = 'index.html';
const SOURCE_SCRIPT_PATH = './scripts';
const SOURCE_FAVICON_FILE = 'favicon.png';
const OUTPUT_STYLE_FILE = 'styles.css';
const OUTPUT_SCRIPT_FILE = 'scripts.js';
const RULES_TEST = {
  JS: /\.js$/,
  HTML: /\.html$/,
  CSS: /\.css$/,
  SCSS: /\.scss$/,
  IMAGE: /\.(jpe?g|png|gif|svg)$/,
  FONT: /\.(eot(\?v=\d+\.\d+\.\d+)?|ttf(\?v=\d+\.\d+\.\d+)?|svg(\?v=\d+\.\d+\.\d+)?|woff(2)*)$/,
};
const DEV_SOURCE_MAP = 'eval-source-map';
const PROD_SOURCE_MAP = false;

const getBabelLoader = env => ({
  loader: 'babel-loader',
  options: {
    comments: isDev(env),
    compact: isDev(env),
    minified: isDev(env),
  },
});
const getEslintLoader = env => ({
  loader: 'eslint-loader',
  options: {
    fix: true,
    emitError: isProd(env),
    emitWarning: isDev(env),
  },
});
const getHtmlLoader = () => ({
  loader: 'html-loader',
});
const getStyleLoader = env => ({
  loader: 'style-loader',
  options: {
    sourceMap: isDev(env),
  },
});
const getCssLoader = env => ({
  loader: 'css-loader',
  options: {
    minimize: isProd(env),
    sourceMap: isDev(env),
  },
});
const getSassLoader = env => ({
  loader: 'sass-loader',
  options: {
    sourceMap: isDev(env),
  },
});
const getPostcssLoader = env => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
    ],
    sourceMap: isDev(env),
  },
});
const getUrlLoader = () => ({
  loader: 'url-loader',
  options: {
    limit: 10000,
  },
});
const getImageWebpackLoader = () => ({
  loader: 'image-webpack-loader',
  options: {
    progressive: true,
    optipng: { optimizationLevel: 7 },
    pngquant: { quality: '65-90' },
  },
});
const getRules = (env) => {
  const ifProd = getIfProd(env);
  const ifDev = getIfDev(env);

  const commonStyleLoaders = removeUndefined([
    ifDev(getStyleLoader(env)),
    getCssLoader(env),
    getPostcssLoader(env),
  ]);
  const cssLoaders = commonStyleLoaders;
  const scssLoaders = [...commonStyleLoaders, getSassLoader(env)];

  return [
    {
      test: RULES_TEST.JS,
      use: [
        getBabelLoader(env),
        getEslintLoader(env),
      ],
    },
    {
      test: RULES_TEST.HTML,
      use: getHtmlLoader(),
    },
    {
      test: RULES_TEST.CSS,
      use: isProd(env) ? ExtractTextPlugin.extract({ use: cssLoaders }) : cssLoaders,
    },
    {
      test: RULES_TEST.SCSS,
      use: isProd(env) ? ExtractTextPlugin.extract({ use: scssLoaders }) : scssLoaders,
    },
    {
      test: RULES_TEST.IMAGE,
      use: removeUndefined([
        getUrlLoader(),
        ifProd(getImageWebpackLoader()),
      ]),
    },
    {
      test: RULES_TEST.FONT,
      use: getUrlLoader(),
    },
  ];
};

const getPlugins = (env) => {
  const ifProd = getIfProd(env);
  const ifDev = getIfDev(env);

  return removeUndefined([
    new HtmlWebpackPlugin({ template: SOURCE_HTML_FILE, favicon: SOURCE_FAVICON_FILE }),
    ifProd(new ExtractTextPlugin({ filename: OUTPUT_STYLE_FILE })),
    ifProd(new CopyWebpackPlugin([{ from: './manifest.json' }])),
    ifDev(new webpack.HotModuleReplacementPlugin()),
    ifDev(new webpack.NamedModulesPlugin()),
    ifDev(new webpack.NoEmitOnErrorsPlugin()),
    ifDev(new StyleLintPlugin({ syntax: 'scss' })),
  ]);
};

module.exports = env => ({
  context: path.resolve(__dirname, SOURCE_DIR),
  entry: SOURCE_SCRIPT_PATH,
  output: {
    path: path.resolve(__dirname, OUTPUT_DIR),
    publicPath: '',
    filename: OUTPUT_SCRIPT_FILE,
  },
  module: {
    rules: getRules(env),
  },
  plugins: getPlugins(env),
  devtool: isDev(env) ? DEV_SOURCE_MAP : PROD_SOURCE_MAP,
  devServer: {
    host: '0.0.0.0', // Equivalent to localhost but can be accessed externally
    hot: true,
    noInfo: true,
    overlay: true,
  },
});

