const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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


module.exports = {
  cssConstants,
  aliases,
  plugins,
};
