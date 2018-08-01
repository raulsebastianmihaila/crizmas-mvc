'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const DefinePlugin = webpack.DefinePlugin;

const isProduction = process.env.NODE_ENV === 'production';

module.exports = isProduction
  ? getProdConfig()
  : getDevConfig();

function getCommonConfig() {
  return {
    context: __dirname,
    entry: ['./src/js/main.js'],
    resolve: {
      modules: ['node_modules', 'src'],
      extensions: ['.js', '.jsx']
    },
    plugins: [],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules(?!\/crizmas)/,
          loader: 'babel-loader',
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
}

function getDevConfig() {
  const config = getCommonConfig();

  Object.assign(config, {
    output: {
      filename: '[name].bundle.js',
      publicPath: '/'
    },
    devServer: {
      contentBase: 'src',
      progress: true,
      hot: true,
      inline: true,
      port: 5555,
      historyApiFallback: {
        index: '/'
      }
    }
  });

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/assets/favicon.ico',
      assetsPrefix: ''
    }),
    new HotModuleReplacementPlugin(),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        basePath: JSON.stringify(null)
      }
    })
  );

  return config;
}

function getProdConfig() {
  const config = getCommonConfig();

  Object.assign(config, {
    output: {
      filename: '[name].bundle-[hash].js',
      publicPath: '/crizmas-mvc-docs/assets/',
      path: `${__dirname}/dist/assets`
    },
  });

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: '../index.html',
      favicon: 'src/assets/favicon.ico',
      assetsPrefix: '/crizmas-mvc-docs'
    }),
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {from: 'src/assets/css', to: 'css'}
    ]),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        basePath: JSON.stringify('crizmas-mvc-docs')
      }
    })
  );

  return config;
}
