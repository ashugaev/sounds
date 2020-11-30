const openBrowser = require('react-dev-utils/openBrowser');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { cssConstants, aliases, plugins } = require('./common');

module.exports = {
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, '../components/index.jsx'),
  ],

  output: {
    filename: '[name].[hash:2].js',
    publicPath: '/',
  },

  devServer: {
    after: () => { openBrowser('http://localhost:1234'); },
    port: 1234,
    disableHostCheck: true,
    historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000',
        logLevel: 'debug',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    // Создает отдельные бандлы с компонентами и нодмодулями
    modules: [path.resolve(__dirname, '../components/'), path.resolve(__dirname, '../node_modules')],
    extensions: ['.js', '.jsx'],
    alias: aliases,
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../components/index.html'),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].[hash:2].css' }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
    }),
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
                localIdentName: '[local]__[hash:base64:3]',
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
