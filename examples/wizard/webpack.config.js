'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DefinePlugin = webpack.DefinePlugin;
const mode = process.env.NODE_ENV;

module.exports = {
  mode,
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle-[hash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: 'src',
    port: 5556,
    historyApiFallback: {
      index: '/'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode)
      }
    })
  ],
  devtool: 'source-map'
};
