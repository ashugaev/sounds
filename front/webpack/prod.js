const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { cssConstants, aliases, plugins } = require('./common');

module.exports = {
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, '../components/index.jsx'),
  ],

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[hash:2].js',
    publicPath: '/',
  },

  resolve: {
    modules: [path.resolve(__dirname, '../components/'), path.resolve(__dirname, '../node_modules')],
    extensions: ['.js', '.jsx'],
    alias: aliases,
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../components/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({ filename: '[hash:2].css' }),
    ...plugins,
  ],

  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
    },
  },

  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
          plugins: [
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
        include: [
          path.resolve(__dirname, '../components'),
          path.resolve(__dirname, '../pages'),
          path.resolve(__dirname, '../stores'),
        ],
      },
      {
        test: /\.sass$/,
        include: [path.resolve(__dirname, '../components'), path.resolve(__dirname, '../pages')],
        loaders: [
          {
            loader: MiniCssExtractPlugin.loader,
          }, {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]',
              },
              importLoaders: 1,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
            },
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: cssConstants,
            },
          },
        ],
      },
      {
        loader: 'file-loader',
        test: /\.svg$/,
        options: {
          name: 'icons/[hash:2].[ext]',
        },
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=10000&mimetype=image/png',
      },
    ],
  },
};
