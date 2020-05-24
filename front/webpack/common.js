const path = require('path');

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
  helpers: path.resolve(__dirname, '../helpers/'),
  query: path.resolve(__dirname, '../helpers/query.js'),
};


module.exports = {
  cssConstants,
  aliases,
};
