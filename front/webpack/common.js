const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const cssConstants = [
  path.resolve(__dirname, '../assets/styles/design-system-variables.sass'),
  path.resolve(__dirname, '../assets/styles/constants.sass'),
];

const aliases = {
  c: path.resolve(__dirname, '../components/'),
  p: path.resolve(__dirname, '../pages/'),
  icons: path.resolve(__dirname, '../assets/icons/'),
  stores: path.resolve(__dirname, '../stores/'),
  join: path.resolve(__dirname, '../helpers/join.js'),
  cnByModifiers: path.resolve(__dirname, '../helpers/cnByModifiers.js'),
  helpers: path.resolve(__dirname, '../helpers/'),
  constants: path.resolve(__dirname, '../constants/'),
  query: path.resolve(__dirname, '../helpers/query.js'),
  '@': path.resolve(__dirname, '../'),
};

const plugins = [
  new CopyPlugin({
    patterns: [
      { from: path.resolve(__dirname, '../assets/icons/logo.svg'), to: '../dist/icons/' },
    ],
  }),
];

const loaders = [{
  test: /\.css$/,
  include: [path.resolve(__dirname, '../node_modules/antd/dist/antd.css')],
  loaders: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [autoprefixer()],
      },
    },
  ],
}];

module.exports = {
  cssConstants,
  aliases,
  plugins,
  loaders,
};
