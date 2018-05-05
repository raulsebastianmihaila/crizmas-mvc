'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: `${__dirname}/src/js/main.js`,
  resolve: {
    modules: [`${__dirname}/src`, 'node_modules']
  },
  devtool: 'source-map',
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // normalization needed for windows
        include: path.normalize(`${__dirname}/src`),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react'],
              plugins: ['transform-es2015-modules-commonjs']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/img/favicon.ico'
    })
  ],
  devServer: {
    contentBase: 'src',
    inline: true,
    port: 5556,
    historyApiFallback: {
      index: '/'
    }
  }
};
