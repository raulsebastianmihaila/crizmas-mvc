'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const NoErrorsPlugin = webpack.NoErrorsPlugin;

module.exports = {
  context: __dirname,
  entry: ['./src/js/main.js'],
  output: {
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: 'src',
    progress: true,
    hot: true,
    inline: true,
    port: 5556,
    historyApiFallback: {
      index: '/'
    }
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: '../index.html'
    }),
    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules(?!\/crizmas)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file',
        query: {name: '[path][name]-[hash].[ext]'}
      }
    ]
  },
  devtool: 'cheap-module-source-map'
};
